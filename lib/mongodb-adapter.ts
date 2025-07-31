import { PrismaClient } from "@prisma/client";
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";

export default function MongoDBAdapter(p: PrismaClient): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      try {
        const createdUser = await p.user.create({
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
          },
        });
        
        return {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email!,
          image: createdUser.image,
          emailVerified: createdUser.emailVerified,
        };
      } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
      }
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      try {
        const user = await p.user.findUnique({ where: { id } });
        if (!user) return null;
        
        return {
          id: user.id,
          name: user.name,
          email: user.email!,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      } catch (error) {
        console.error('Error in getUser:', error);
        return null;
      }
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      try {
        const user = await p.user.findUnique({ where: { email } });
        if (!user) return null;
        
        return {
          id: user.id,
          name: user.name,
          email: user.email!,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      } catch (error) {
        console.error('Error in getUserByEmail:', error);
        return null;
      }
    },

    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<AdapterUser | null> {
      try {
        const account = await p.account.findFirst({
          where: {
            provider,
            providerAccountId,
          },
          include: {
            user: true
          },
        });

        if (!account?.user) {
          console.warn(`Account found but no user associated - provider: ${provider}, providerAccountId: ${providerAccountId}`);
          return null;
        }

        return {
          id: account.user.id,
          name: account.user.name,
          email: account.user.email!,
          image: account.user.image,
          emailVerified: account.user.emailVerified,
        };
      } catch (error) {
        console.error('Error in getUserByAccount:', error);
        return null;
      }
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      try {
        const updatedUser = await p.user.update({
          where: { id: user.id },
          data: {
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
          },
        });
        
        return {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email!,
          image: updatedUser.image,
          emailVerified: updatedUser.emailVerified,
        };
      } catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
      }
    },

    async deleteUser(userId: string): Promise<void> {
      try {
        await p.account.deleteMany({ where: { userId } });
        await p.session.deleteMany({ where: { userId } });
        await p.user.delete({ where: { id: userId } });
      } catch (error) {
        console.error('Error in deleteUser:', error);
        throw error;
      }
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      try {
        // First try to update existing account if it exists
        const updatedAccount = await p.account.update({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }
          },
          data: {
            userId: account.userId,
            type: account.type,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          },
        });
        
        console.log('Updated existing account:', updatedAccount);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (updateError: any) {
        if (updateError.code === 'P2025') {
          // No existing account found, create a new one
          try {
            const createdAccount = await p.account.create({
              data: {
                userId: account.userId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
            console.log('Created new account:', createdAccount);
          } catch (createError) {
            console.error('Error creating account:', createError);
            throw createError;
          }
        } else {
          console.error('Error updating account:', updateError);
          throw updateError;
        }
      }
    },

    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<void> {
      try {
        await p.account.deleteMany({
          where: {
            provider,
            providerAccountId,
          },
        });
      } catch (error) {
        console.error('Error in unlinkAccount:', error);
        throw error;
      }
    },

    async createSession({ sessionToken, userId, expires }: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
      try {
        const session = await p.session.create({
          data: {
            sessionToken,
            userId,
            expires,
          },
        });
        
        return {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        };
      } catch (error) {
        console.error('Error in createSession:', error);
        throw error;
      }
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      try {
        const sessionAndUser = await p.session.findUnique({
          where: { sessionToken },
          include: { user: true },
        });

        if (!sessionAndUser?.user) return null;

        return {
          session: {
            sessionToken: sessionAndUser.sessionToken,
            userId: sessionAndUser.userId,
            expires: sessionAndUser.expires,
          },
          user: {
            id: sessionAndUser.user.id,
            name: sessionAndUser.user.name,
            email: sessionAndUser.user.email!,
            image: sessionAndUser.user.image,
            emailVerified: sessionAndUser.user.emailVerified,
          },
        };
      } catch (error) {
        console.error('Error in getSessionAndUser:', error);
        return null;
      }
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      try {
        const updatedSession = await p.session.update({
          where: { sessionToken: session.sessionToken },
          data: {
            expires: session.expires,
            userId: session.userId,
          },
        });

        return {
          sessionToken: updatedSession.sessionToken,
          userId: updatedSession.userId,
          expires: updatedSession.expires,
        };
      } catch (error) {
        console.error('Error in updateSession:', error);
        return null;
      }
    },

    async deleteSession(sessionToken: string): Promise<void> {
      try {
        await p.session.delete({ where: { sessionToken } });
      } catch (error) {
        console.error('Error in deleteSession:', error);
        throw error;
      }
    },

    async createVerificationToken(token: VerificationToken): Promise<VerificationToken | null | undefined> {
      try {
        const createdToken = await p.verificationToken.create({ data: token });
        
        return {
          identifier: createdToken.identifier,
          token: createdToken.token,
          expires: createdToken.expires,
        };
      } catch (error) {
        console.error('Error in createVerificationToken:', error);
        return null;
      }
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }): Promise<VerificationToken | null> {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token: { identifier, token } },
        });
        
        return {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
          expires: verificationToken.expires,
        };
      } catch (error) {
        console.error('Error in useVerificationToken:', error);
        return null;
      }
    },
  };
}