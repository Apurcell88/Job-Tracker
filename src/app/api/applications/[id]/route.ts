import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const data = await req.json();

    const updatedApp = await prisma.application.update({
      where: { id },
      data: {
        company: data.company,
        position: data.position,
        status: data.status ?? undefined,
        appliedDate: data.appliedDate ? new Date(data.appliedDate) : undefined,
      },
    });

    return NextResponse.json(updatedApp, { status: 200 });
  } catch (err) {
    console.error("Error updating application:", err);
    return NextResponse.json(
      { error: "Unable to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting application:", err);
    return NextResponse.json(
      { error: "Unable to delete application" },
      { status: 500 }
    );
  }
}
