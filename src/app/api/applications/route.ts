import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
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

  // ✅ upsert by clerkId, not by id
  return prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: { email, name },
    create: {
      clerkId: clerkUserId, // ✅ REQUIRED
      email,
      name,
    },
  });
}

// GET: Fetch all applications
export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await ensureDbUser(clerkUserId);

    const applications = await prisma.application.findMany({
      where: { userId: dbUser.id }, // ✅ DB user id
      include: { tags: true },
      orderBy: { appliedDate: "desc" },
    });

    return NextResponse.json(applications);
  } catch (err) {
    console.error("GET /api/applications error:", err);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST: create a new application
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await ensureDbUser(clerkUserId);

    const body = await req.json();
    const {
      company,
      position,
      location,
      jobUrl,
      notes,
      resumeLink,
      contactName,
      contactEmail,
      contactPhone,
      appliedDate,
      followUpdate,
      status,
      tags,
    } = body;

    if (!company || !position) {
      return NextResponse.json(
        { error: "Company and position are required." },
        { status: 400 }
      );
    }

    // Optional: connect to existing tags by name
    let tagConnections: { id: string }[] = [];
    if (tags && Array.isArray(tags)) {
      tagConnections = await Promise.all(
        tags.map(async (tag: string | { name: string }) => {
          const tagName = typeof tag === "string" ? tag : tag.name;
          return prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
        })
      );
    }

    const newApp = await prisma.application.create({
      data: {
        userId: dbUser.id,
        company,
        position,
        location,
        jobUrl,
        notes,
        resumeLink,
        contactName,
        contactEmail,
        contactPhone,
        appliedDate: appliedDate ? new Date(appliedDate) : undefined,
        followUpDate: followUpdate ? new Date(followUpdate) : undefined,
        status, // Optional, defaults to APPLIED
        tags: tagConnections.length
          ? {
              connect: tagConnections.map((tag) => ({ id: tag.id })),
            }
          : undefined,
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(newApp, { status: 201 });
  } catch (err) {
    console.error("Error creating application:", err);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
