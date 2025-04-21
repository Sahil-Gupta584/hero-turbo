-- CreateTable
CREATE TABLE "VideoEditor" (
    "videoId" TEXT NOT NULL,
    "editorId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoEditor_pkey" PRIMARY KEY ("videoId","editorId")
);

-- AddForeignKey
ALTER TABLE "VideoEditor" ADD CONSTRAINT "VideoEditor_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoEditor" ADD CONSTRAINT "VideoEditor_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
