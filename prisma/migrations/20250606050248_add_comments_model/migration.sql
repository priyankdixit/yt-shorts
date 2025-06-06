/*
  Warnings:

  - You are about to drop the column `likes` on the `Shorts` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Shorts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shorts" DROP COLUMN "likes",
DROP COLUMN "views";

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shortId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_shortId_fkey" FOREIGN KEY ("shortId") REFERENCES "Shorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
