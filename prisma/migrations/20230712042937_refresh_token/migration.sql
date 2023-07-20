-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_first_logged" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "refresh_token" TEXT;
