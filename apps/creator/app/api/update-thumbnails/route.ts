import { prisma } from "@repo/db";
import { getGoogleServices } from "@repo/lib/actions";
import { TUpdateThumbnailsProps } from "@repo/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("payload", payload);
    const { videos, ownerId } = payload as TUpdateThumbnailsProps;

    if (!videos || !ownerId) {
      throw new Error("Invalid Payload");
    }

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

    return NextResponse.json({
      result: updatedVideos,
      ok: true,
    });
  } catch (error) {
    console.log("error in /update-thumbnails:", error);
    return NextResponse.json({ ok: false, error });
  }
}
