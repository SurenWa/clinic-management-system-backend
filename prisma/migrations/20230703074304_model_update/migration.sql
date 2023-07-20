/*
  Warnings:

  - You are about to drop the column `assigned_role` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `Doctor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role_name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[department_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_name` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_user_id_fkey";

-- DropIndex
DROP INDEX "Role_assigned_role_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "assigned_role",
ADD COLUMN     "role_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "degrees" TEXT,
ADD COLUMN     "department_id" INTEGER NOT NULL,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "service_place" TEXT,
ADD COLUMN     "specialist" TEXT,
ADD COLUMN     "work_experience" INTEGER;

-- DropTable
DROP TABLE "Doctor";

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_department_id_key" ON "User"("department_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
