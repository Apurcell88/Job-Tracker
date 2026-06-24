import { Status } from "@/generated/prisma";
import { ApplicationCard } from "../../types";

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const demoApplications: ApplicationCard[] = [
  {
    id: "demo-1",
    company: "Northstar Analytics",
    position: "Frontend Engineer",
    status: Status.INTERVIEWING,
    appliedDate: daysFromNow(-4),
    jobUrl: "https://example.com/frontend-engineer",
    notes: "Initial recruiter screen went well. Prep dashboard questions.",
    contactName: "Maya Chen",
    contactEmail: "maya.chen@example.com",
    tags: [
      { id: "demo-tag-remote", name: "Remote" },
      { id: "demo-tag-react", name: "React" },
    ],
  },
  {
    id: "demo-2",
    company: "BrightPath Health",
    position: "Full Stack Developer",
    status: Status.APPLIED,
    appliedDate: daysFromNow(-7),
    notes: "Follow up with hiring team after one week.",
    tags: [
      { id: "demo-tag-health", name: "HealthTech" },
      { id: "demo-tag-node", name: "Node" },
    ],
  },
  {
    id: "demo-3",
    company: "LumenGrid",
    position: "Product Engineer",
    status: Status.OFFER,
    appliedDate: daysFromNow(-18),
    notes: "Offer received. Compare benefits and remote policy.",
    tags: [
      { id: "demo-tag-hybrid", name: "Hybrid" },
      { id: "demo-tag-product", name: "Product" },
    ],
  },
  {
    id: "demo-4",
    company: "Atlas Supply Co.",
    position: "Software Engineer II",
    status: Status.REJECTED,
    appliedDate: daysFromNow(-21),
    notes: "Good interview practice. Reapply after platform migration work.",
    tags: [{ id: "demo-tag-logistics", name: "Logistics" }],
  },
  {
    id: "demo-5",
    company: "Cedar Labs",
    position: "UI Engineer",
    status: Status.APPLIED,
    appliedDate: daysFromNow(-2),
    tags: [
      { id: "demo-tag-design", name: "Design Systems" },
      { id: "demo-tag-react", name: "React" },
    ],
  },
];

export const demoStats = {
  total: demoApplications.length,
  interviews: demoApplications.filter((app) => app.status === Status.INTERVIEWING)
    .length,
  offers: demoApplications.filter((app) => app.status === Status.OFFER).length,
  rejections: demoApplications.filter((app) => app.status === Status.REJECTED)
    .length,
};

export const demoReminders = {
  upcoming: [
    {
      id: "demo-2",
      company: "BrightPath Health",
      position: "Full Stack Developer",
      appliedDate: daysFromNow(-7),
      followUpDate: daysFromNow(2),
    },
    {
      id: "demo-5",
      company: "Cedar Labs",
      position: "UI Engineer",
      appliedDate: daysFromNow(-2),
      followUpDate: daysFromNow(5),
    },
  ],
  overdue: [
    {
      id: "demo-1",
      company: "Northstar Analytics",
      position: "Frontend Engineer",
      appliedDate: daysFromNow(-4),
      followUpDate: daysFromNow(-1),
    },
  ],
};

export const demoInterviews = [
  {
    id: "demo-1",
    company: "Northstar Analytics",
    interviewDate: daysFromNow(0),
  },
];
