import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const interviews = await prisma.application.findMany({
      where: {
        userId,
        status: "INTERVIEWING",
        interviewDate: {
          gte: today,
        },
        NOT: [{ status: "REJECTED" }, { status: "ARCHIVED" }],
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
