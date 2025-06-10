-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_shortId_fkey";

-- DropForeignKey
ALTER TABLE "ShortView" DROP CONSTRAINT "ShortView_shortId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_shortId_fkey" FOREIGN KEY ("shortId") REFERENCES "Shorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortView" ADD CONSTRAINT "ShortView_shortId_fkey" FOREIGN KEY ("shortId") REFERENCES "Shorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
