import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      applications: {
        orderBy: { appliedDate: "desc" },
        take: 5,
        select: {
          id: true,
          company: true,
          position: true,
          status: true,
          appliedDate: true,
          tags: true,
        },
      },
    },
  });

  return NextResponse.json(user?.applications || []);
}
