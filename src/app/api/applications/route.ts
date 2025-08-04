import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// GET: Fetch all applications
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        tags: true,
      },
      orderBy: {
        appliedDate: "desc",
      },
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        tags.map(async (tag: string) => {
          return prisma.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag },
          });
        })
      );
    }

    const newApp = await prisma.application.create({
      data: {
        userId,
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
