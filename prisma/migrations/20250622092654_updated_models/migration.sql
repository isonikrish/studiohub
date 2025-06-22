/*
  Warnings:

  - You are about to drop the column `descruption` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `description` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "descruption",
ADD COLUMN     "description" TEXT NOT NULL;
