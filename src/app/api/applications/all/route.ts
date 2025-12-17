import { PrismaClient } from "@/generated/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await ensureDbUser(clerkUserId);

  const allApplications = await prisma.application.findMany({
    where: { userId: dbUser.id }, // ✅ DB user id
    orderBy: { appliedDate: "desc" },
    select: {
      id: true,
      company: true,
      position: true,
      status: true,
      appliedDate: true,
      notes: true,
      jobUrl: true,
      contactName: true,
      contactPhone: true,
      contactEmail: true,
      tags: true,
    },
  });

  return NextResponse.json(allApplications);
}
