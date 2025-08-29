import { AuthOptions } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import MongoDBAdapter from '@/lib/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email ?? `${profile.login}@github.com`,
          image: profile.avatar_url,
        };
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
          phone: user.phone ?? null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider !== 'credentials') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? undefined },
        });

        if (existingUser) {
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider,
            },
          });

          if (!existingAccount && account) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                ...(account.access_token && { access_token: account.access_token }),
                ...(account.expires_at && { expires_at: account.expires_at }),
                ...(account.token_type && { token_type: account.token_type }),
                ...(account.scope && { scope: account.scope }),
                ...(account.id_token && { id_token: account.id_token }),
                ...(account.session_state && { session_state: account.session_state }),
              },
            });
          }

          user.id = existingUser.id;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        if (account.access_token) token.accessToken = account.access_token;
        if (account.provider) token.provider = account.provider;
      }

      if (user) {
        token.user = {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
          phone: user.phone ?? null,
        };
      }

      if (token.id && !user) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        });

        if (freshUser) {
          token.user = {
            id: freshUser.id,
            name: freshUser.name ?? null,
            email: freshUser.email ?? null,
            image: freshUser.image ?? null,
            phone: freshUser.phone ?? null,
          };
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.user) {
        // Type assertion to ensure TypeScript recognizes the extended Session interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any) = {
          id: token.sub ?? token.user.id,
          name: token.user.name ?? session.user?.name ?? null,
          email: token.user.email ?? session.user?.email ?? null,
          image: token.user.image ?? session.user?.image ?? null,
          phone: token.user.phone ?? null,
        };
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};