/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { stat } from "fs";

const prisma = new PrismaClient();

async function ensureDbUser(clerkUserId: string) {
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkUserId);

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) throw new Error("Clerk user has no email");

  const name =
    clerkUser.firstName || clerkUser.lastName
      ? `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim()
      : null;

  // already linked
  const byClerk = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });
  if (byClerk) {
    return prisma.user.update({
      where: { id: byClerk.id },
      data: { email, name },
    });
  }

  // link by email to avoid P2002
  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { clerkId: clerkUserId, name },
    });
  }

  // create
  return prisma.user.create({
    data: { clerkId: clerkUserId, email, name },
  });
}

export async function PATCH(req: NextRequest, context: any) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, interviewDate, followUpDate } = await req.json();

  try {
    const dbUser = await ensureDbUser(clerkUserId);

    const dataToUpdate: any = { status };

    if (status === "INTERVIEWING" && interviewDate) {
      dataToUpdate.interviewDate = new Date(interviewDate);
    }

    // update only if this app belings to the signed-in DB user
    const result = await prisma.application.updateMany({
      where: { id: context.params.id, userId: dbUser.id },
      data: dataToUpdate,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updatedApp = await prisma.application.findFirst({
      where: {
        id: context.params.id,
        userId: dbUser.id,
      },
      include: { tags: true },
    });

    return NextResponse.json({ message: "Status updated", updatedApp });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", code: err?.code, message: err?.message },
      { status: 500 }
    );
  }
}
