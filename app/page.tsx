import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import ShortsList from "@/components/ShortsList";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const loggedInUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!loggedInUser) {
    await prisma.user.create({
      data: {
        name: user.fullName || "Name",
        email: user.emailAddresses[0].emailAddress,
        clerkUserId: user.id,
      },
    });
  }

  const shorts = await prisma.shorts.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      url: true,
      createdAt: true,
      updateAt: true,
      userId: true,
      viewsCount: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ShortsList initialShorts={shorts} />;
}
