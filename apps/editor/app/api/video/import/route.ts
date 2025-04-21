import { addVideoRecord } from "@/lib/dbActions";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const videoFile = formData.get("videoFile") as File;
        const importerId = formData.get("importerId") as string;
        const ownerId = formData.get("ownerId") as string;
        console.log("formData", formData);

        if (!videoFile) {
            return NextResponse.json({ ok: false, error: "No file uploaded" });
        }

        // Authenticate Google Drive API
        const auth = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );
        auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

        const drive = google.drive({ version: "v3", auth });

        // 🔹 STEP 1: Check if the folder exists
        const folderName = "Syncly";
        const folderId = await getOrCreateFolder(drive, folderName);

        const fileSize = videoFile.size;
        const accessToken = await auth.getAccessToken();

        // Step 1: Initiate Resumable Upload
        const lastChunkRes = prisma.$transaction(async () => {
            const res = await axios.post(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
                {
                    name: videoFile.name,
                    parents: [folderId],
                    mimeType: videoFile.type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken.token}`,
                        "X-Upload-Content-Type": videoFile.type,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("res", res.data);

            const uploadUrl = res.headers["location"]; // Extract upload URL

            if (!uploadUrl) {
                throw new Error("Failed to get resumable upload URL");
            }

            // Step 3: Upload Video in Chunks
            const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB
            const buffer = await videoFile.arrayBuffer();
            let lastChunkRes = null;

            for (let start = 0; start < fileSize; start += CHUNK_SIZE) {
                const chunk = buffer.slice(start, Math.min(start + CHUNK_SIZE, fileSize));

                const res = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Length": chunk.byteLength.toString(),
                        "Content-Range": `bytes ${start}-${Math.min(start + CHUNK_SIZE, fileSize) - 1}/${fileSize}`,
                    },
                    body: chunk,
                });
                lastChunkRes = res;
            }
            console.log("lastChunkRes before json", lastChunkRes);
            if (lastChunkRes && lastChunkRes.ok) {
                lastChunkRes = await lastChunkRes.json();
                console.log("lastChunkRes after json", lastChunkRes);
                console.log({
                    createdAt: Date.now(),
                    gDriveId: lastChunkRes.id,
                    title: "",
                    importedById: importerId,
                    ownerId,
                    status: "DRAFT",
                });

                await addVideoRecord({ gDriveId: lastChunkRes.id, importedById: importerId, ownerId });
            }
        });

        return NextResponse.json({ ok: true, message: "Upload complete" });
    } catch (error) {
        // console.log("Error uploading video:", error);
        return NextResponse.json({ ok: false, error });
    }
}

// 🔹 Helper function to get or create a folder
async function getOrCreateFolder(drive: any, folderName: string): Promise<string> {
    try {
        const folderSearch = await drive.files.list({
            q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: "files(id, name)",
        });

        if (folderSearch.data.files.length > 0) {
            return folderSearch.data.files[0].id;
        }

        const folder = await drive.files.create({
            requestBody: {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
            },
            fields: "id",
        });

        return folder.data.id;
    } catch (error) {
        console.error("Error creating folder:", error);
        throw new Error("Failed to create folder");
    }
}
