import { google } from "googleapis";

export async function getFileFromDrive(driveFileId: string) {
    try {
        console.log("driveFileId", driveFileId);

        if (driveFileId.length <= 1) throw new Error("No file ID provided");
        const auth = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );
        auth.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

        const drive = google.drive({ version: "v3", auth });

        // Get file metadata to check MIME type
        const fileMetadata = await drive.files.get({
            fileId: driveFileId,
            fields: "mimeType, name",
        });

        console.log("File Metadata:", fileMetadata.data);

        // Check if it's a binary file (not a Google Doc)
        if (fileMetadata.data.mimeType?.includes("application/vnd.google-apps")) {
            throw new Error("Cannot download Google Docs files directly. Export required.");
        }

        // Get file as stream
        const fileStream = await drive.files.get(
            {
                fileId: driveFileId,
                alt: "media",
            },
            { responseType: "stream" }
        );

        return fileStream.data;
    } catch (error) {
        console.log("Error in getFileFromDrive:", error);
        throw error;
    }
}

type TBackendRes<T> = {
    ok: boolean;
    error?: Error;
    result: T | null;
};

export const backendRes = <T = undefined>({ ok, error, result }: TBackendRes<T>): TBackendRes<T> => {
    return {
        ok,
        error,
        result,
    };
};
