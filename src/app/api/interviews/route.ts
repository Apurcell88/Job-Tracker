import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();

    const interviews = await prisma.application.findMany({
      where: {
        userId,
        status: "INTERVIEWING",
        interviewDate: {
          gte: now,
        },
      },
      select: {
        id: true,
        company: true,
        interviewDate: true,
      },
      orderBy: {
        interviewDate: "asc",
      },
    });

    return NextResponse.json(interviews);
  } catch (err) {
    console.error(err);
    NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
