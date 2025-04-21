"use server";

import { prisma } from "@repo/db";
import { backendRes } from "@repo/lib/utils";
import moment from "moment";

export async function handleAcceptInvite({
  editorId,
  inviteId,
}: {
  editorId: string;
  inviteId: string;
}) {
  try {
    const isExists = prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      include: { creator: true },
    });
    if (!isExists) throw new Error("Invite not found");

    const updateInvite = await prisma.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        status: "ACCEPTED",
        editorId,
      },
    });

    const createCreatorEditor = await prisma.creatorEditor.create({
      data: {
        editorId,
        creatorId: updateInvite.creatorId,
      },
      include: { creator: true },
    });
    return backendRes({ ok: true, result: createCreatorEditor });
  } catch (error) {
    console.log("Error from handleAcceptInvite :", error);
    return backendRes({ ok: false, result: null, error: error as Error });
  }
}

export async function getInviteDetails(inviteId: string) {
  try {
    const isExists = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      include: { creator: true },
    });
    if (!isExists) throw new Error("Invalid Invite Link");
    const isExpired = moment().unix() > Number(isExists.expiresAt);
    if (isExpired) throw new Error("Invite Link Has Been Expired!");
    return backendRes({ ok: true, result: isExists });
  } catch (error) {
    console.log("Error from getInviteDetails :", error);
    return backendRes({ ok: false, result: null, error: error as Error });
  }
}

export async function getEditorVideos(editorId: string) {
  try {
    const isExists = await prisma.user.findUnique({
      where: {
        id: editorId,
      },
      include: {
        accessibleVideos: {
          include: { video: { include: { channel: true, importedBy: true } } },
        },
      },
    });
    if (!isExists) throw new Error("Creator not found");
    return backendRes({ ok: true, result: isExists });
  } catch (error) {
    console.log("Error from getEditorVideos :", error);
    return backendRes({ ok: false, result: null, error: error as Error });
  }
}
export async function getEditorCreators(editorId: string) {
  try {
    const isExists = await prisma.user.findUnique({
      where: {
        id: editorId,
      },
      include: {
        creators:true
      },
    });
    if (!isExists) throw new Error("Creator not found");
    return backendRes({ ok: true, result: isExists });
  } catch (error) {
    console.log("Error from getEditorVideos :", error);
    return backendRes({ ok: false, result: null, error: error as Error });
  }
}
