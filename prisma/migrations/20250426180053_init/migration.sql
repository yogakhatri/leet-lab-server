-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verificationToken" DROP NOT NULL,
ALTER COLUMN "verificationTokenExpiry" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "refreshTokenExpiry" DROP NOT NULL,
ALTER COLUMN "passwordResetToken" DROP NOT NULL,
ALTER COLUMN "passwordResetTokenExpiry" DROP NOT NULL,
ALTER COLUMN "accessToken" DROP NOT NULL,
ALTER COLUMN "accessTokenExpiry" DROP NOT NULL;
