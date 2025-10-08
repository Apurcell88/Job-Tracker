import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const allApplications = await prisma.application.findMany({
    where: { userId },
    orderBy: { appliedDate: "desc" },
    select: {
      id: true,
      company: true,
      position: true,
      status: true,
      appliedDate: true,
      notes: true,
      jobUrl: true,
      contactName: true,
      contactPhone: true,
      contactEmail: true,
      tags: true,
    },
  });

  return NextResponse.json(allApplications);
}
