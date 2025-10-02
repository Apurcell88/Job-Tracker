import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const total = await prisma.application.count({
    where: { userId },
  });

  const recentApplications = await prisma.application.findMany({
    where: { userId },
    orderBy: { appliedDate: "desc" },
    take: 5,
    select: {
      id: true,
      company: true,
      position: true,
      status: true,
      appliedDate: true,
      notes: true,
      contactName: true,
      contactPhone: true,
      contactEmail: true,
      tags: true,
    },
  });

  return NextResponse.json({
    total,
    recentApplications,
  });
}
