import { PrismaClient, Status } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

  const byClerk = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });
  if (byClerk) {
    return prisma.user.update({
      where: { id: byClerk.id },
      data: { email, name },
    });
  }

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { clerkId: clerkUserId, name },
    });
  }

  return prisma.user.create({
    data: { clerkId: clerkUserId, email, name },
  });
}

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await ensureDbUser(clerkUserId);

    // start of day for "today"
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const excludedStatuses: Status[] = ["REJECTED", "ARCHIVED"];

    const baseWhere = {
      userId: dbUser.id,
      followUpCompleted: false,
      status: { notIn: excludedStatuses },
    };

    // upcoming within [today .. nextWeek]
    const upcoming = await prisma.application.findMany({
      where: {
        ...baseWhere,
        followUpDate: {
          gte: today,
          lte: nextWeek,
        },
        status: { notIn: ["REJECTED", "ARCHIVED"] },
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
        ...baseWhere,
        followUpDate: { lt: today },
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
