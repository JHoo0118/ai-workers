-- CreateEnum
CREATE TYPE "SignupType" AS ENUM ('EMAIL', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "SignupType" NOT NULL DEFAULT 'EMAIL',
ALTER COLUMN "password" DROP NOT NULL;
