/*
  Warnings:

  - You are about to drop the column `user_id` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_department_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department_id",
DROP COLUMN "role_id";
