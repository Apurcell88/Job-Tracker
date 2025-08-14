import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: Record<string, string> } // <-- updated type
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;

    const updated = await prisma.application.updateMany({
      where: { id, userId },
      data: { followUpCompleted: true },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        {
          error: "Application not found or not authorized.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/applications/:id/follow-up-complete error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
