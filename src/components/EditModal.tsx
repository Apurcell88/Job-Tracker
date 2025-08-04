"use client";

import { useState } from "react";
// import { Status } from "@/generated/prisma";
// import { Tag } from "../../types";
import { ApplicationCard } from "../../types";

// type EditableApplication = {
//   id: string;
//   company: string;
//   position: string;
//   status: Status;
//   appliedDate: string;
//   tags: Tag[];
// };
type EditableApplication = Omit<ApplicationCard, "tags"> & {
  tags: { name: string }[];
};

type Props = {
  application: ApplicationCard;
  onClose: () => void;
  onSave: (updated: EditableApplication) => Promise<void>;
};

const EditModal = ({ application, onClose, onSave }: Props) => {
  const [form, setForm] = useState({
    ...application,
    tags: application.tags?.map((tag) => tag.name).join(", ") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tags" ? value : value,
    }));
  };

  const handleSubmit = () => {
    const tagsArray = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    onSave({ ...form, tags: tagsArray });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Edit Application</h2>

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Company"
        />
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Position"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Tags (comma separated)"
        />

        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
