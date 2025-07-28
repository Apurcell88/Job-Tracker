import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET: Fetch all applications
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
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
    const body = await req.json();
    const {
      userId,
      company,
      position,
      location,
      status,
      jobUrl,
      notes,
      resumeLink,
      contactName,
      contactEmail,
      contactPhone,
      appliedDate,
      followUpDate,
      tags,
    } = body;

    const newApplication = await prisma.application.create({
      data: {
        userId,
        company,
        position,
        location,
        status,
        jobUrl,
        notes,
        resumeLink,
        contactName,
        contactEmail,
        contactPhone,
        appliedDate: appliedDate ? new Date(appliedDate) : undefined,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        tags: tags?.length
          ? { connect: tags.map((tagId: string) => ({ id: tagId })) }
          : undefined,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (err) {
    console.error("POST /api/applications error:", err);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
