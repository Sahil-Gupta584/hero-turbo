// app/api/download/[videoId]/route.ts
import { prisma } from "@repo/db";
import { getGoogleServices } from "@repo/lib/actions";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = await params;
  console.log("videoId", videoId);
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { owner: { include: { channels: true } } },
  });

  if (!video) {
    return new Response(JSON.stringify({ error: "Video not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { result, error } = await getGoogleServices(video.ownerId);
  if (!result) {
    throw new Error("Failed to get Google services: " + error?.message);
  }
  const { drive } = result;

  const driveRes = await drive.files.get(
    { fileId: video.gDriveId, alt: "media" },
    { responseType: "stream" }
  );

  const readable = driveRes.data as unknown as ReadableStream<Uint8Array>;

  return new Response(readable, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${video.title}.mp4"`,
    },
  });
}
