import { getFileFromDrive } from "@/lib/utils";
import { prisma } from "@repo/db";
import axios from "axios";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formdata = await req.json();
    console.log("formdata", formdata);

    if (!formdata.videoId) {
      return NextResponse.json({ message: "Video Id is required", ok: false });
    }

    const isVideoExist = await prisma.video.findUnique({
      where: { id: formdata.videoId },
    });

    if (!isVideoExist) {
      return NextResponse.json({ message: "Video does not exist", ok: false });
    }

    if (
      !process.env.YOUTUBE_CLIENT_ID ||
      !process.env.YOUTUBE_CLIENT_SECRET ||
      !process.env.YOUTUBE_REDIRECT_URI ||
      !process.env.YOUTUBE_REFRESH_TOKEN
    ) {
      throw new Error(
        "Missing YouTube API credentials in environment variables"
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const gDriveStream = await getFileFromDrive(isVideoExist.gDriveId);
    const videoResponse = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: isVideoExist.title,
          description: isVideoExist.description,
          categoryId: isVideoExist.categoryId,
          tags: isVideoExist.tags?.split(","),
        },
        status: {
          privacyStatus: "public",
        },
      },
      media: {
        body: gDriveStream,
        mimeType: "video/mp4",
      },
    });
    // console.log("videoResponse", videoResponse);
    if (isVideoExist.thumbnailUrl?.trim()) {
      const imageResponse = await axios.get(isVideoExist.thumbnailUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(imageResponse.data);

      const thumbnailResponse = await youtube.thumbnails.set({
        videoId: videoResponse.data.id as string,
        media: {
          mimeType: imageResponse.headers["content-type"],
          body: buffer,
        },
      });

      console.log("Thumbnail uploaded:", thumbnailResponse.data);
    }
    for (const id of isVideoExist.playlistIds) {
      await youtube.playlistItems.insert({
        part: ["snippet"],
        requestBody: {
          snippet: {
            playlistId: id,
            resourceId: {
              kind: "youtube#video",
              videoId: videoResponse.data.id,
            },
          },
        },
      });
    }

    return NextResponse.json({
      message: "Video Published successfully",
      ok: true,
      data: videoResponse,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error });
  }
}
