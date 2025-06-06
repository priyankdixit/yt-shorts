import { auth } from "@clerk/nextjs/server"; // ✅ for server-side auth
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================
// GET /api/shorts/[id]/comments
// =========================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: shortId } = await context.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { shortId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /comments error:", error);
    return new Response("Failed to fetch comments", { status: 500 });
  }
}

// =========================
// POST /api/shorts/[id]/comments
// =========================
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: shortId } = await context.params;
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  try {
    const body = await req.json();

    const comment = await prisma.comment.create({
      data: {
        text: body.text,
        shortId,
        userId: user.id, // ✅ using internal user ID
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /comments error:", error);
    return new Response("Failed to post comment", { status: 500 });
  }
}
