"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Status } from "@/generated/prisma";

type CreateAppFormProps = {
  onCreate: (newApp: ApplicationCard) => void;
};

type ApplicationCard = {
  id: string;
  company: string;
  position: string;
  status: Status;
  appliedDate: string;
};

const CreateAppForm = ({ onCreate }: CreateAppFormProps) => {
  const [form, setForm] = useState({
    company: "",
    position: "",
    location: "",
    status: "APPLIED",
    jobUrl: "",
    notes: "",
    resumeLink: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    appliedDate: "",
    followUpdate: "",
    tags: "", // comma-separated string
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Correct timezone issue for appliedDate and followUpdate
    const appliedDate = form.appliedDate
      ? new Date(form.appliedDate + "T00:00:00").toISOString()
      : null;

    const followUpdate = form.followUpdate
      ? new Date(form.followUpdate + "T00:00:00").toISOString()
      : null;

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: tagList,
          appliedDate,
          followUpdate,
        }),
      });

      if (res.ok) {
        const createdApp = await res.json();
        onCreate(createdApp);
        toast.success("Application added!");
        setForm({
          company: "",
          position: "",
          location: "",
          status: "APPLIED",
          jobUrl: "",
          notes: "",
          resumeLink: "",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          appliedDate: "",
          followUpdate: "",
          tags: "",
        });
      } else {
        const error = await res.json();
        toast.error(error?.error || "Failed to create application");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        name="company"
        placeholder="Company"
        value={form.company}
        onChange={handleChange}
        required
        className="mr-2"
      />
      <input
        name="position"
        placeholder="Position"
        value={form.position}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="mr-2"
      />
      <input
        name="jobUrl"
        placeholder="Job URL"
        value={form.jobUrl}
        onChange={handleChange}
      />
      <input
        name="resumeLink"
        placeholder="Resume Link"
        value={form.resumeLink}
        onChange={handleChange}
      />
      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        className="ml-2"
      />
      <input
        name="contactName"
        placeholder="Contact Name"
        value={form.contactName}
        onChange={handleChange}
        className="mr-2"
      />
      <input
        name="contactEmail"
        placeholder="Contact Email"
        value={form.contactEmail}
        onChange={handleChange}
      />
      <input
        name="contactPhone"
        placeholder="Contact Phone"
        value={form.contactPhone}
        onChange={handleChange}
        className="mr-2"
      />
      <div>
        <label
          htmlFor="appliedDate"
          className="block text-sm font-medium text-gray-700"
        >
          Applied Date{" "}
          <span className="text-xs text-gray-500">
            (When you submitted the application)
          </span>
        </label>
        <input
          type="date"
          id="appliedDate"
          name="appliedDate"
          value={form.appliedDate}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="followUpdate"
          className="block text-sm font-medium text-gray-700"
        >
          Follow-Up Date{" "}
          <span className="text-xs text-gray-500">
            (When to follow up on this application)
          </span>
        </label>
        <input
          type="date"
          id="followUpdate"
          name="followUpdate"
          value={form.followUpdate}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="cursor-pointer bg-blue-700 text-white px-4 py-2 m-2 rounded"
      >
        Add Application
      </button>
    </form>
  );
};

export default CreateAppForm;
