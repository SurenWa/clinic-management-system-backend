/*
  Warnings:

  - You are about to drop the column `name` on the `Department` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[department_name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department_name` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Department_name_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "name",
ADD COLUMN     "department_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_department_name_key" ON "Department"("department_name");
