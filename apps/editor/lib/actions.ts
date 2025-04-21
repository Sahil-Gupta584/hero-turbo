"use server";

import { prisma } from "@repo/db";
import { google } from "googleapis";
import nodemailer from "nodemailer";
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
            result: { videoLink: file.data.webViewLink.replace("view?usp=drivesdk", "preview") },
        });
    } catch (error) {
        console.error("Error in getVideoLink:", error);
        return backendRes({ ok: false, error: error as Error, result: null });
    }
}

export async function getPlaylists() {
    try {
        const auth = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );
        auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

        const youtube = google.youtube({ version: "v3", auth });

        const res = await youtube.playlists.list({
            // fileId: gDriveId,
            part: ["snippet"],
            channelId: "UCZsNBvo4uxh6GdA7Y-ERqOw",
        });

        // console.log("res", res.data);

        return backendRes({
            ok: true,
            result: { data: res.data.items },
        });
    } catch (error) {
        console.error("Error in getVideoLink:", error);
        return backendRes({ ok: false, error: error as Error, result: null });
    }
}

export async function UploadImgGetUrl({ imgFile }: { imgFile: File }) {
    try {
        const blob = new Blob([imgFile], { type: imgFile.type });

        const form = new FormData();
        form.append("image", blob, imgFile.name);

        const res = await fetch("https://api.imgbb.com/1/upload?key=b10b7ca5ecd048d6a0ed9f9751cebbdc", {
            method: "POST",
            body: form,
        });

        const result = await res.json();

        return backendRes({ ok: true, result: { displayUrl: result.data.display_url } });
    } catch (error) {
        throw error;
    }
}



