import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await req.json();

  try {
    const updated = await prisma.application.updateMany({
      where: {
        id: params.id,
        userId,
      },
      data: { status },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        {
          error: "Application not found or unauthorized",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
