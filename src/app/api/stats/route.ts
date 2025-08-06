import { PrismaClient } from "@/generated/prisma";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const [total, interviews, offers, rejections] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.application.count({ where: { userId, status: "INTERVIEWING" } }),
    prisma.application.count({ where: { userId, status: "OFFER" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
  ]);

  return NextResponse.json({ total, interviews, offers, rejections });
}
