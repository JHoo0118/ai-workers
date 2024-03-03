-- DropForeignKey
ALTER TABLE "DownloadLog" DROP CONSTRAINT "DownloadLog_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_userEmail_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLog" ADD CONSTRAINT "DownloadLog_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
