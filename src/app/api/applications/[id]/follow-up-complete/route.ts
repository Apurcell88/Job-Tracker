import { PrismaClient } from "@/generated/prisma";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(_request: Request, context: any) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = context.params;

    const dbUser = await ensureDbUser(clerkUserId);

    const updated = await prisma.application.updateMany({
      where: { id, userId: dbUser.id },
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
