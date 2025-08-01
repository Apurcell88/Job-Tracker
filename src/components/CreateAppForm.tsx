"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const CreateAppForm = () => {
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

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: tagList }),
      });

      if (res.ok) {
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
      <input
        type="date"
        name="appliedDate"
        value={form.appliedDate}
        onChange={handleChange}
        className="mr-2"
      />
      <input
        type="date"
        name="followUpdate"
        value={form.followUpdate}
        onChange={handleChange}
      />
      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
      />
      <button type="submit" className="cursor-pointer">
        Add Application
      </button>
    </form>
  );
};

export default CreateAppForm;
