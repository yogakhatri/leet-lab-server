/*
  Warnings:

  - The `verificationTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `refreshTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `passwordResetTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `accessTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verificationTokenExpiry",
ADD COLUMN     "verificationTokenExpiry" INTEGER,
DROP COLUMN "refreshTokenExpiry",
ADD COLUMN     "refreshTokenExpiry" INTEGER,
DROP COLUMN "passwordResetTokenExpiry",
ADD COLUMN     "passwordResetTokenExpiry" INTEGER,
DROP COLUMN "accessTokenExpiry",
ADD COLUMN     "accessTokenExpiry" INTEGER;
