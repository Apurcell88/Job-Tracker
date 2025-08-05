import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const reminders = await prisma.application.findMany({
    where: {
      followUpDate: {
        gte: today,
        lte: nextWeek,
      },
    },
    orderBy: { followUpDate: "asc" },
  });

  return NextResponse.json(reminders);
}
