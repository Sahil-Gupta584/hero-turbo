"use server";

import { prisma } from "@repo/db";
import { google } from "googleapis";
import { backendRes } from "./utils";
export async function getVideoDetails(videoId: string) {
  try {
    if (!videoId) throw new Error("Video ID is required");

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    });
    if (!video) throw new Error("Video not found");

    return backendRes({
      ok: true,
      result: video,
    });
  } catch (error) {
    console.error("Error in getVideoLink:", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}
export async function getVideoLink(gDriveId: string) {
  try {
    const auth = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );
    auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

    const drive = google.drive({ version: "v3", auth });

    const file = await drive.files.get({
      fileId: gDriveId,
      fields: "webViewLink",
    });

    if (!file.data.webViewLink) {
      throw new Error("Video not found");
    }

    return backendRes({
      ok: true,
      result: {
        videoLink: file.data.webViewLink.replace(
          "view?usp=drivesdk",
          "preview"
        ),
      },
    });
  } catch (error) {
    console.error("Error in getVideoLink:", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}
