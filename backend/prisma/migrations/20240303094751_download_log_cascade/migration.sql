-- DropForeignKey
ALTER TABLE "DownloadLog" DROP CONSTRAINT "DownloadLog_fileId_fkey";

-- AddForeignKey
ALTER TABLE "DownloadLog" ADD CONSTRAINT "DownloadLog_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
