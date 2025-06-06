-- AlterTable
ALTER TABLE "Shorts" ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ShortView" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortView_shortId_userId_key" ON "ShortView"("shortId", "userId");

-- AddForeignKey
ALTER TABLE "ShortView" ADD CONSTRAINT "ShortView_shortId_fkey" FOREIGN KEY ("shortId") REFERENCES "Shorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortView" ADD CONSTRAINT "ShortView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
