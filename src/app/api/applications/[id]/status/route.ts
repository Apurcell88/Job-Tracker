/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, context: any) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, interviewDate } = await req.json();

  try {
    const dataToUpdate: any = { status };

    if (status === "INTERVIEWING" && interviewDate) {
      dataToUpdate.interviewDate = new Date(interviewDate);
    }

    const updatedApp = await prisma.application.update({
      where: {
        id: context.params.id,
        userId,
      },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: "Status updated", updatedApp });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
