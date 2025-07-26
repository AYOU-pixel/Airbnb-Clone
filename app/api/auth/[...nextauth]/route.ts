// api/auth/[...nextauth]/route.ts (Fixed typo in filename and improved)
import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('❌ Missing credentials');
            return null;
          }

          console.log('🔵 Attempting to find user:', credentials.email);

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            console.log('❌ User not found or no password');
            return null;
          }

          console.log('🔵 User found, checking password...');

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log('❌ Invalid password');
            return null;
          }

          console.log('✅ Authentication successful for user:', user.id);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('❌ Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      console.log('🔵 Session callback - token:', token.sub);
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      console.log('🔵 Session callback - final session:', session.user);
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log('🔵 JWT callback - adding user to token:', user.id);
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };