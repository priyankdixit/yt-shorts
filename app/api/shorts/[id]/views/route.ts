// app/api/shorts/[id]/views/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: shortId } = await context.params;
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Find internal user by Clerk userId
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  try {
    const lastView = await prisma.shortView.findUnique({
      where: {
        shortId_userId: {
          shortId,
          userId: user.id,
        },
      },
    });

    if (!lastView) {
      await prisma.shortView.create({
        data: {
          shortId,
          userId: user.id,
          viewedAt: now,
        },
      });

      await prisma.shorts.update({
        where: { id: shortId },
        data: {
          viewsCount: { increment: 1 },
        },
      });

      return new Response("View counted", { status: 201 });
    } else if (lastView.viewedAt < dayAgo) {
      await prisma.shortView.update({
        where: { id: lastView.id },
        data: { viewedAt: now },
      });

      await prisma.shorts.update({
        where: { id: shortId },
        data: {
          viewsCount: { increment: 1 },
        },
      });

      return new Response("View counted after 24h", { status: 200 });
    } else {
      return new Response("View not counted (cooldown)", { status: 200 });
    }
  } catch (error) {
    console.error("POST /views error:", error);
    return new Response("Failed to update views", { status: 500 });
  }
}
