"use client";

import CreateAppForm from "./CreateAppForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationCard } from "../../types";

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
