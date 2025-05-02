import { PrismaAdapter } from "@auth/prisma-adapter";
import { PlanType, prisma } from "@repo/db";
import { getGoogleServices } from "@repo/lib/actions";
import { TRole } from "@repo/lib/constants";
import moment from "moment";
import NextAuth, { NextAuthResult } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { channelAccessScopes } from "./app/constants";

const result = NextAuth(() => {
  return {
    adapter: PrismaAdapter(prisma),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
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
          if (!user.id) {
            console.warn("No user id found in account for user", user.id);
            return;
          }
          const { result, error } = await getGoogleServices(user.id);
          if (!result) {
            throw new Error("Failed to get Google services: " + error?.message);
          }
          const { youtube } = result;
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

          await prisma.channel.create({
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
        } catch (error) {
          console.error("Error creating channel:", error);
        }
      },
      async createUser({ user }) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "TRIAL" as PlanType,
              role: "CREATOR",
              trialEndAt: moment().add(14, "day").unix().toString(),
            },
          });
        } catch (error) {
          console.error("Error creating user:", error);
        }
      },
    },
    callbacks: {
      async jwt({ token }) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        token.plan = dbUser?.plan;
        token.role = dbUser?.role ?? "CREATOR";
        token.id = dbUser?.id;
        token.creatorId = dbUser?.id;
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
