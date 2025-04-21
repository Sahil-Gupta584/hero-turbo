import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@repo/db";
import { google } from "googleapis";
import NextAuth, { NextAuthResult } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { channelAccessScopes, TRole } from "./app/constants";

const result = NextAuth(() => {
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.YOUTUBE_CLIENT_ID,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
        authorization: {
          params: {
            scope: channelAccessScopes.join(" "),
            access_type: "offline",
            prompt: "consent",
          },
        },
        profile(profile) {
          return {
            email: profile.email,
            id: profile.id,
            name: profile.name,
            image: profile.picture,
            role: "CREATOR",
          };
        },
      }),
    ],
    session: { strategy: "jwt" },
    events: {
      async linkAccount({ user }) {
        try {
          const oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID!,
            process.env.YOUTUBE_CLIENT_SECRET!,
            process.env.YOUTUBE_REDIRECT_URI!
          );

          // Optional: fetch user's account to get refresh token
          const dbAccount = await prisma.account.findFirst({
            where: {
              userId: user.id,
              provider: "google",
            },
          });

          if (!dbAccount?.refresh_token) {
            console.warn("No refresh_token found in account for user", user.id);
            return;
          }

          oauth2Client.setCredentials({
            refresh_token: dbAccount.refresh_token,
          });

          const youtube = google.youtube({ version: "v3", auth: oauth2Client });
          const res = await youtube.channels.list({
            part: ["snippet", "contentDetails"],
            mine: true,
          });

          if (
            !res.data.items ||
            res.data.items.length === 0 ||
            !res.data.items[0]?.snippet ||
            !res.data.items[0].snippet.thumbnails?.medium
          ) {
            console.warn("YouTube channel data not found.");
            return;
          }

          const channel = await prisma.channel.create({
            data: {
              access_token: dbAccount.access_token || "",
              refresh_token: dbAccount.refresh_token,
              logoUrl: res.data.items[0].snippet.thumbnails.medium.url ?? "",
              description: res.data.items[0].snippet.description ?? "",
              name: res.data.items[0].snippet.title ?? "",
              ytChannelId: res.data.items[0].id!,
              user: {
                connect: { id: user.id },
              },
            },
          });
          // console.log("YouTube channel created:", channel);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      },
    },
    callbacks: {
      async jwt({ token, user, trigger, session, account }) {
        // Add refresh token to JWT on initial sign in
        if (account && account.refresh_token) {
          token.refresh_token = account.refresh_token;
        }

        // If we don't have a refresh token in the token but user is authenticated,
        // try to fetch it from the database
        if (!token.refresh_token && token.email) {
          const dbAccount = await prisma.account.findFirst({
            where: {
              user: {
                email: token.email,
              },
              provider: "google",
            },
            // select: {
            //     refresh_token: true,
            // },
          });

          // if (dbAccount?.refresh_token) {
          //     token.refresh_token = dbAccount.refresh_token;
          // }
        }

        // Add user info to token
        if (!token.role) {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email! },
          });
          token.plan = dbUser?.plan;
          token.role = dbUser?.role ?? "CREATOR";
          token.id = dbUser?.id;
          token.creatorId = dbUser?.id;
        }
        return token;
      },

      async session({ session, token }) {
        session.user.role = token.role as TRole;
        session.user.id = token.id as string;

        if (token.refresh_token) {
          session.refresh_token = token.refresh_token as string;
        }

        return session;
      },
    },
  };
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
