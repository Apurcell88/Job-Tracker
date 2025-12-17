import { PrismaClient } from "@/generated/prisma";
import { NextResponse, NextRequest } from "next/server";
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

  return prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: { email, name },
    create: { clerkId: clerkUserId, email, name },
  });
}

export async function GET(_req: NextRequest) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dbUser = await ensureDbUser(clerkUserId);

    const [total, interviews, offers, rejections] = await Promise.all([
      prisma.application.count({ where: { userId: dbUser.id } }),
      prisma.application.count({
        where: { userId: dbUser.id, status: "INTERVIEWING" },
      }),
      prisma.application.count({
        where: { userId: dbUser.id, status: "OFFER" },
      }),
      prisma.application.count({
        where: { userId: dbUser.id, status: "REJECTED" },
      }),
    ]);

    return NextResponse.json({ total, interviews, offers, rejections });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
