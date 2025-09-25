import { PrismaClient } from "@/generated/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [total, interviews, offers, rejections] = await Promise.all([
      prisma.application.count({ where: { userId } }),
      prisma.application.count({ where: { userId, status: "INTERVIEWING" } }),
      prisma.application.count({ where: { userId, status: "OFFER" } }),
      prisma.application.count({ where: { userId, status: "REJECTED" } }),
    ]);

    return NextResponse.json({ total, interviews, offers, rejections });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
