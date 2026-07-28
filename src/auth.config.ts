import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 1. Explicitly import the base types before augmenting
import { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // 2. Extend the imported JWT interface
  interface JWT {
    id: string;
  }
}

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // In v5, NEXTAUTH_SECRET is automatically detected as AUTH_SECRET
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.image = token.picture;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
