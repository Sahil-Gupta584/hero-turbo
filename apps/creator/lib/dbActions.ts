"use server";

import { TVideoForm } from "@/app/videos/[videoId]/page";
import { prisma } from "@repo/db";
import { backendRes } from "@repo/lib/utils";
import console from "console";
import { google } from "googleapis";

export async function getUserVideos(userId: string) {
  try {
    console.log("started");

    const res = await prisma.video.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: true,
        importedBy: true,
        channel: true,
      },
    });
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from getUserVideos", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function updateVideoDetails(videoDetails: Partial<TVideoForm>) {
  try {
    console.log("videoDetails", videoDetails);
    
    const res = await prisma.$transaction(async (tx) => {
      const updatedVideo = await tx.video.update({
        where: { id: videoDetails.id },
        data: {
          categoryId: videoDetails.categoryId,
          description: videoDetails.description,
          playlistIds: videoDetails.playlistIds,
          thumbnailUrl: videoDetails.thumbnailUrl,
          tags: videoDetails.tags,
          title: videoDetails.title,
          scheduledAt: videoDetails.scheduledAt,
        },
      });
      
      if (videoDetails.selectedEditorsId !== undefined) {
        // Delete all existing editor connections for this video
        await tx.videoEditor.deleteMany({
          where: { videoId: videoDetails.id }
        });
        
        // Create new connections only for the selected editors
        if (videoDetails.selectedEditorsId.length > 0) {
          await tx.videoEditor.createMany({
            data: videoDetails.selectedEditorsId.map(editorId => ({
              videoId: videoDetails.id!,
              editorId: editorId
            }))
          });
        }
      }
      
      return updatedVideo;
    });
    
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from updateVideoDetails", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function getUserWithEditors({ userId }: { userId: string }) {
  try {
    if (!userId) {
      return backendRes({
        ok: false,
        error: new Error("userId is required"),
        result: null,
      });
    }
    const res = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: { editors: { include: { editor: true } }, channels: true },
    });
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from getCreatorDetails", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function addChannel({
  code,
  userId,
}: {
  code: string;
  userId: string;
}) {
  try {
    console.log("code:", code);

    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      `${process.env.CREATOR_BASE_URL}/addChannel`
    );

    const { tokens } = await oauth2Client.getToken(code);
    console.log("tokens:", tokens);
    oauth2Client.setCredentials(tokens);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("No access token received from Google.");
    }

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const channelResponse = await youtube.channels.list({
      part: ["snippet", "contentDetails"],
      mine: true,
    });
    console.log("channelResponse:", JSON.stringify(channelResponse.data));
    if (
      !channelResponse.data.items ||
      channelResponse.data.items.length === 0 ||
      !channelResponse.data.items[0]?.snippet ||
      !channelResponse.data.items[0].snippet.thumbnails?.medium
    ) {
      throw new Error("No channel data found.");
    }
    const isChannelExist = await prisma.channel.findUnique({
      where: { ytChannelId: channelResponse.data.items[0].id! },
    });
    if (isChannelExist)
      throw new Error("This Channel is already in your space.");
    const channel = await prisma.channel.create({
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        logoUrl:
          channelResponse.data.items[0].snippet.thumbnails.medium.url ?? "",
        description: channelResponse.data.items[0].snippet.description ?? "",
        name: channelResponse.data.items[0].snippet.title ?? "",
        ytChannelId: channelResponse.data.items[0].id!,
        user: {
          connect: { id: userId },
        },
      },
    });

    return backendRes({ ok: true, result: true });
  } catch (error) {
    console.error("Error adding channel with Google APIs:", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function getCreatorDetails({ userId }: { userId: string }) {
  try {
    if (!userId) {
      return backendRes({
        ok: false,
        error: new Error("userId is required"),
        result: null,
      });
    }
    const res = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        editors: { include: { editor: true } },
        ownedVideos: { include: { channel: true, importedBy: true } },
        channels: true,
      },
    });
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from getCreatorDetails", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function removeEditor({
  editorId,
  creatorId,
}: {
  editorId: string;
  creatorId: string;
}) {
  try {
    const res = await prisma.creatorEditor.delete({
      where: {
        creatorId_editorId: {
          editorId,
          creatorId,
        },
      },
    });

    const deleteInvite = await prisma.invite.deleteMany({
      where: {
        creatorId,
        editorId,
      },
    });
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from removeEditor", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function getCreatorEditors({ creatorId }: { creatorId: string }) {
  try {
    const res = await prisma.creatorEditor.findMany({
      where: {
        creatorId,
      },
      include: { editor: true },
    });
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from getCreatorEditors", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function getCreatorChannels({ creatorId }: { creatorId: string }) {
  try {
    const res = await prisma.channel.findMany({
      where: { userId: creatorId },
    });
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from getCreatorChannels", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}
export async function getVideoEditors({ videoId }: { videoId: string }) {
  try {
    const res = await prisma.videoEditor.findMany({
      where: { videoId },
      include: { editor: true },
    });
    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from getVideoEditors", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}
