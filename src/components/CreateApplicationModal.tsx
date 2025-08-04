"use client";

import CreateAppForm from "./CreateAppForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Status } from "@/generated/prisma";

type ApplicationCard = {
  id: string;
  company: string;
  position: string;
  status: Status;
  appliedDate: string;
};

const CreateApplicationModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (newApp: ApplicationCard) => void;
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <CreateAppForm onCreate={onCreate} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateApplicationModal;
