-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerUserId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "chatId" DROP NOT NULL;
