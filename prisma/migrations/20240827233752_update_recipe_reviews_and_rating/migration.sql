/*
  Warnings:

  - Made the column `avgRating` on table `recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "avgRating" SET NOT NULL,
ALTER COLUMN "avgRating" SET DEFAULT 0;
