import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = await currentUser();

  // Step 1: Ensure User exists in your DB
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      clerkId: userId,
      email: user?.emailAddresses?.[0]?.emailAddress || "",
      name: user?.firstName || "",
    },
  });

  // Step 2: Update all applications to point to Clerk user
  const result = await prisma.application.updateMany({
    data: { userId },
  });

  return NextResponse.json({ updated: result.count });
}
