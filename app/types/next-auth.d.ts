/* eslint-disable @typescript-eslint/no-unused-vars */
// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
    };
    accessToken?: string;
    provider?: string;
  }
}