"use server";

import { TVideoDetails } from "@/app/videos/[videoId]/page";
import { PlanType, prisma } from "@repo/db";
import { getGoogleServices, updateThumbnails } from "@repo/lib/actions";
import { backendRes } from "@repo/lib/utils";
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
    console.log("error from getUserWithEditors", error);
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
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.CREATOR_BASE_URL}/addChannel`
    );

    const { tokens } = await oauth2Client.getToken(code);
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
      throw new Error("userId is required");
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

    const videosWithoutThumbnail = [];
    if (res) {
      for (const video of res.ownedVideos) {
        if (!video.thumbnailUrl) {
          videosWithoutThumbnail.push(video);
        }
      }

      if (videosWithoutThumbnail.length > 0) {
        const updatedVideoRes = await updateThumbnails({
          videos: videosWithoutThumbnail.map((v) => ({
            gDriveId: v.gDriveId,
            videoId: v.id,
          })),
          ownerId: userId,
        });

        if (updatedVideoRes.result) {
          for (const video of updatedVideoRes.result.videos) {
            const videoIndex = res.ownedVideos.findIndex(
              (v) => v.id === video.videoId
            );
            if (videoIndex !== -1 && res.ownedVideos[videoIndex]) {
              res.ownedVideos[videoIndex].thumbnailUrl =
                video.thumbnailLink as string;
            }
          }
        }
      }
    }

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

export async function updateVideoDetails(videoDetails: TVideoDetails) {
  try {
    console.log("videoDetails", videoDetails);
    const {
      categoryId,
      id,
      playlistIds,
      scheduledAt,
      selectedEditorsId,
      tags,
      thumbnailUrl,
      title,
      description,
      gDriveId,
      editors,
      channelId,
    } = videoDetails;
    const res = await prisma.$transaction(async (tx) => {
      const updatedVideo = await tx.video.update({
        where: { id: videoDetails.id },
        data: {
          categoryId: categoryId,
          description: description,
          playlistIds: playlistIds,
          thumbnailUrl: thumbnailUrl,
          tags: tags,
          title: title,
          scheduledAt: scheduledAt,
          channelId,
        },
        include: { owner: true },
      });
      console.log("updatedVideo", updatedVideo);
      const existingEditorIds = editors.map((e) => e.editorId);

      const toAdd = selectedEditorsId.filter(
        (id) => !existingEditorIds.includes(id)
      );
      const toRemove = existingEditorIds.filter(
        (id) => !selectedEditorsId.includes(id)
      );

      await tx.videoEditor.deleteMany({
        where: {
          videoId: id,
          editorId: { in: toRemove },
        },
      });

      // Add only new editors
      await tx.videoEditor.createMany({
        data: toAdd.map((editorId) => ({
          videoId: id!,
          editorId,
        })),
      });
      return updatedVideo;
    });
    await updateGoogleDrivePermissions({
      gDriveId,
      selectedEditorEmails: editors.map((e) => e.editor.email),
      videoOwnerEmail: res.owner.email,
      videoOwnerId: res.owner.id,
    });

    return backendRes({ ok: true, result: res });
  } catch (error) {
    console.log("error from updateVideoDetails", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

async function updateGoogleDrivePermissions({
  gDriveId,
  selectedEditorEmails,
  videoOwnerEmail,
  videoOwnerId,
}: {
  gDriveId: string;
  selectedEditorEmails: string[];
  videoOwnerEmail: string;
  videoOwnerId: string;
}) {
  const { result } = await getGoogleServices(videoOwnerId); // or ownerId if needed
  if (!result) throw new Error("Failed to get Google services");

  const { drive } = result;

  const permissions = await drive.permissions.list({
    fileId: gDriveId,
    fields: "permissions(id,emailAddress)",
  });

  const existingEmails =
    permissions.data.permissions?.map((p) => p.emailAddress) ?? [];

  const toGrant = selectedEditorEmails.filter(
    (email) => !existingEmails.includes(email)
  );
  const toRevoke = existingEmails.filter(
    (email) => !selectedEditorEmails.includes(email as string)
  );
  console.log("toGrant", toGrant);
  await Promise.all(
    toGrant.map((email) =>
      drive.permissions.create({
        fileId: gDriveId,
        requestBody: {
          role: "writer",
          type: "user",
          emailAddress: email,
        },
      })
    )
  );

  await Promise.all(
    permissions.data
      .permissions!.filter(
        (p) =>
          toRevoke.includes(p.emailAddress!) &&
          p.emailAddress !== videoOwnerEmail
      )
      .map((p) => {
        if (p.emailAddress === videoOwnerEmail) return;

        drive.permissions.delete({ fileId: gDriveId, permissionId: p.id! });
      })
  );
}

export async function updatePlan({
  planType,
  userId,
}: {
  userId: string;
  planType: PlanType;
}) {
  try {
    const isExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!isExists) throw new Error("User not found");
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan: planType },
    });
    return backendRes({ ok: true, result: updatedUser });
  } catch (error) {
    console.log("error from updatePlan", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}
