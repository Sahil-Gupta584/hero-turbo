"use server";
import { prisma } from "@repo/db";
import { google } from "googleapis";
import { Readable } from "nodemailer/lib/xoauth2";
import { defaultVideoDesc, defaultVideoTitle } from "./constants";
import { backendRes, TUpdateThumbnailsProps } from "./utils";

export async function getGoogleServices(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { channels: true },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const auth = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    auth.setCredentials({
      refresh_token: user.channels[0]?.refresh_token,
    });

    const youtube = google.youtube({ version: "v3", auth });
    const drive = google.drive({ version: "v3", auth });

    return backendRes({
      ok: true,
      result: { youtube, drive },
    });
  } catch (error) {
    console.error("Error in getGoogleServices:", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

export async function getVideoLink(videoId: string) {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      include: { owner: { include: { channels: true } } },
    });
    if (!video) {
      throw new Error("Video not found");
    }
    const { result, error } = await getGoogleServices(video.ownerId);
    if (!result) {
      throw new Error("Failed to get Google services: " + error?.message);
    }
    const { drive } = result;

    const file = await drive.files.get({
      fileId: video.gDriveId,
      fields: "webViewLink, webContentLink",
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

export async function deleteVideo(videoId: string, ownerId: string) {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
      include: { owner: { include: { channels: true } } },
    });
    if (!video) {
      throw new Error("Video not found");
    }
    const { result, error } = await getGoogleServices(video.ownerId);
    if (!result) {
      throw new Error("Failed to get Google services: " + error?.message);
    }
    const { drive } = result;
    await prisma.$transaction(async () => {
      await drive.files.delete({
        fileId: video.gDriveId,
      });
      await prisma.video.delete({
        where: {
          id: videoId,
        },
      });
    });

    return backendRes({ ok: true, result: null });
  } catch (error) {
    console.error("Error in deleteVideo:", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}

type VideoUploadParams = {
  importerId: string;
  ownerId: string;
  editors?: { id: string; email: string }[];
  channelId?: string;
  videoFile: File;
};

export async function uploadVideoAction({
  videoDetails,
  CREATOR_BASE_URL,
}: {
  videoDetails: VideoUploadParams;
  CREATOR_BASE_URL: string;
}) {
  try {
    if (!videoDetails.videoFile) {
      throw new Error("Video file not provided.");
    }
    console.log("videoDetails", videoDetails);

    const { channelId, importerId, ownerId, videoFile, editors } = videoDetails;
    const { result, error } = await getGoogleServices(ownerId);
    if (!result) {
      throw new Error("Failed to get Google services: " + error?.message);
    }
    const { drive } = result;
    const folderId = await getOrCreateFolder(drive, "Syncly");

    const { gDriveId, video } = await prisma.$transaction(async (tx) => {
      const buffer = await videoFile.arrayBuffer();
      const stream = bufferToStream(buffer);

      const uploadedFileData = await drive.files.create({
        requestBody: {
          name: videoFile.name,
          parents: [folderId],
          mimeType: videoFile.type,
        },
        media: {
          mimeType: videoFile.type,
          body: stream,
        },
        fields: "id, thumbnailLink",
      });

      if (!uploadedFileData.data.id) {
        throw new Error("Failed to upload video to Google Drive");
      }
      const video = await prisma.video.create({
        data: {
          createdAt: `${Date.now() / 1000}`,
          gDriveId: uploadedFileData.data.id,
          title: defaultVideoTitle,
          description: defaultVideoDesc,
          importedById: importerId,
          ownerId,
          categoryId: "22",
          tags: "",
          channelId,
          thumbnailUrl: uploadedFileData.data.thumbnailLink,
        },
      });
      return { video, gDriveId: uploadedFileData.data.id };
    });

    if (editors) {
      for (const { email, id } of editors) {
        await prisma.videoEditor.create({
          data: { videoId: video.id, editorId: id },
        });

        await drive.permissions.create({
          fileId: gDriveId,
          requestBody: {
            role: "reader",
            type: "user",
            emailAddress: email,
          },
        });
      }
    }
    await updateThumbnails({
      ownerId: videoDetails.ownerId,
      videos: [{ gDriveId, videoId: video.id }],
    });
    return backendRes({
      ok: true,
      result: video,
    });
  } catch (error: any) {
    console.error("Error from uploadVideoAction:", error);
    return backendRes({
      ok: false,
      error: error as Error,
      result: null,
    });
  }
}

async function getOrCreateFolder(
  drive: any,
  folderName: string
): Promise<string> {
  const folderSearch = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });

  if (folderSearch.data.files.length > 0) {
    return folderSearch.data.files[0].id!;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  return folder.data.id!;
}

function bufferToStream(buffer: ArrayBuffer): Readable {
  const readable = new Readable();
  readable.push(Buffer.from(buffer));
  readable.push(null); // End the stream
  return readable;
}

export async function updateThumbnails({
  videos,
  ownerId,
}: TUpdateThumbnailsProps) {
  try {
    const { result, error } = await getGoogleServices(ownerId);
    if (!result) {
      throw new Error("Failed to get Google services: " + error?.message);
    }
    const { drive } = result;
    const updatedVideos: TUpdateThumbnailsProps = { videos: [], ownerId };
    for (const { videoId, gDriveId } of videos) {
      const file = await drive.files.get({
        fileId: gDriveId,
        fields: "thumbnailLink",
      });

      if (!file.data.thumbnailLink) {
        throw new Error("Thumbnail not found");
      }
      const imgFile = await fetch(file.data.thumbnailLink);
      const blob = await imgFile.blob();

      const form = new FormData();
      form.append("image", blob, videoId);

      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=b10b7ca5ecd048d6a0ed9f9751cebbdc",
        {
          method: "POST",
          body: form,
        }
      );
      if (!res.ok) {
        console.log("res", res);
        throw new Error("Failed to get url from imgbb");
      }
      const result = await res.json();
      const updatedVideo = await prisma.video.update({
        where: {
          id: videoId,
        },
        data: {
          thumbnailUrl: result.data.display_url,
        },
      });
      updatedVideos.videos.push({
        gDriveId: gDriveId,
        videoId: updatedVideo.id,
        thumbnailLink: updatedVideo.thumbnailUrl as string,
      });
    }

    return backendRes({
      ok: true,
      result: updatedVideos as TUpdateThumbnailsProps,
    });
  } catch (error) {
    console.error("Error in updateThumbnails:", error);
    return backendRes({ ok: false, error: error as Error, result: null });
  }
}
