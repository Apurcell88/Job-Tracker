import { Status } from "@/generated/prisma";

export type Tag = {
  id: string;
  name: string;
};

export type ApplicationCard = {
  id: string;
  company: string;
  position: string;
  status: Status;
  appliedDate: string;
  notes?: string;
  jobUrl?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  tags: Tag[];
};

export type NewApplicationFormData = Omit<ApplicationCard, "id">;
