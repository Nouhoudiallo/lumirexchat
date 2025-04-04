/*
  Warnings:

  - A unique constraint covering the columns `[clerUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_clerUserId_key" ON "User"("clerUserId");
