import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@repo/db";
import NextAuth, { NextAuthResult } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { TRole } from "./app/constants";

const result = NextAuth(() => {
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.YOUTUBE_CLIENT_ID,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
        profile(profile) {
          console.log("profile", profile);

          return {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            image: profile.picture,
            role: "EDITOR",
          };
        },
      }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
      async jwt({ token, user, trigger, session, account }) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        token.role = dbUser?.role;
        token.id = dbUser?.id;

        return token;
      },

      async session({ session, token }) {
        session.user.role = token.role as TRole;
        session.user.id = token.id as string;
        return session;
      },
    },
  };
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
