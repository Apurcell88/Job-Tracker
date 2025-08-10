import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // start of day for "today"
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    // upcoming within [today .. nextWeek]
    const upcoming = await prisma.application.findMany({
      where: {
        userId,
        followUpCompleted: false,
        followUpDate: {
          gte: today,
          lte: nextWeek,
        },
      },
      orderBy: { followUpDate: "asc" },
      select: {
        id: true,
        company: true,
        position: true,
        followUpDate: true,
      },
    });

    // overdue: followUpDate < today
    const overdue = await prisma.application.findMany({
      where: {
        userId,
        followUpCompleted: false,
        followUpDate: {
          lt: today,
        },
      },
      orderBy: { followUpDate: "asc" },
      select: {
        id: true,
        company: true,
        position: true,
        followUpDate: true,
      },
    });

    return NextResponse.json({ upcoming, overdue });
  } catch (err) {
    console.error("GET /api/reminders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
