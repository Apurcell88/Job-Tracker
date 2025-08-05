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
  tags: Tag[];
};

export type NewApplicationFormData = Omit<ApplicationCard, "id">;
