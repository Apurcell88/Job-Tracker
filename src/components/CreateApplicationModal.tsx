"use client";

import CreateAppForm from "./CreateAppForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreateApplicationModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <CreateAppForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateApplicationModal;
