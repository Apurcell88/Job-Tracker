import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const reminders = await prisma.application.findMany({
    where: {
      userId,
      followUpDate: {
        gte: today,
        lte: nextWeek,
      },
    },
    orderBy: { followUpDate: "asc" },
  });

  return NextResponse.json(reminders);
}
