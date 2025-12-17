import { PrismaClient, Status } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Create some tags
  const [frontendTag, remoteTag, urgentTag] = await Promise.all([
    prisma.tag.create({ data: { name: "Frontend" } }),
    prisma.tag.create({ data: { name: "Remote" } }),
    prisma.tag.create({ data: { name: "Urgent" } }),
  ]);

  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      clerkId: "demo_clerk_user",
    },
  });

  // Create applications
  await prisma.application.create({
    data: {
      userId: user.id,
      company: "Tastytrade",
      position: "Frontend Engineer",
      location: "Chicago, IL",
      status: Status.APPLIED,
      jobUrl: "https://example.com/job/tastytrade",
      notes: "Strong match for my skillset. Reach out by next week",
      resumeLink: "https://resumes.com/demo.pdf",
      contactName: "Jane Doe",
      contactEmail: "jane@tastytrade.com",
      contactPhone: "555-1234",
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from today
      tags: {
        connect: [{ id: frontendTag.id }, { id: remoteTag.id }],
      },
    },
  });

  await prisma.application.create({
    data: {
      userId: user.id,
      company: "TechCorp",
      position: "React Developer",
      location: "Remote",
      status: Status.INTERVIEWING,
      jobUrl: "https://example.com/job/techcorp",
      notes: "Had first-round technical. Waiting on recruiter.",
      resumeLink: "https://resumes.com/demo-react.pdf",
      contactName: "Tom Smith",
      contactEmail: "tom@techcorp.com",
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: {
        connect: [{ id: urgentTag.id }],
      },
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
