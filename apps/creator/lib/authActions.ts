"use server";

import { signIn } from "@/auth";

export async function login(redirectTo: string = "/") {
  await signIn("google", { redirectTo });
}
export async function getGoogleAuthUrl() {
  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const redirectUri = `${process.env.CREATOR_BASE_URL}/addChannel`;
    if (!clientId) {
      throw new Error("YOUTUBE_CLIENT_ID is not defined");
    }
    if (!process.env.CREATOR_BASE_URL) {
      throw new Error("CREATOR_BASE_URL is not defined");
    }
    const scopes = [
      "https://www.googleapis.com/auth/youtubepartner-channel-audit",
      "https://www.googleapis.com/auth/youtube.upload",
    ];
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join(" ")}&access_type=offline&prompt=consent`;
    return authUrl;
  } catch (error) {
    console.error("Error generating Google Auth URL:", error);

    throw error; // Rethrow the error to be handled by the caller
  }
}
