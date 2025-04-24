import { getGoogleServices } from "@repo/lib/actions";

export async function getFileFromDrive(driveFileId: string, userId: string) {
  try {
    console.log("driveFileId", driveFileId);

    if (driveFileId.length <= 1) throw new Error("No file ID provided");
    const { result, error } = await getGoogleServices(userId);
    if (!result) {
      throw new Error("Failed to get Google services: " + error?.message);
    }
    const { drive } = result;

    // Get file metadata to check MIME type
    const fileMetadata = await drive.files.get({
      fileId: driveFileId,
      fields: "mimeType, name",
    });

    console.log("File Metadata:", fileMetadata.data);

    // Check if it's a binary file (not a Google Doc)
    if (fileMetadata.data.mimeType?.includes("application/vnd.google-apps")) {
      throw new Error(
        "Cannot download Google Docs files directly. Export required."
      );
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
