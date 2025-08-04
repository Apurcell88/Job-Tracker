"use client";

import { useEffect, useState } from "react";
import { Status } from "@/generated/prisma";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import CreateApplicationModal from "./CreateApplicationModal";
import { ApplicationCard } from "../../types";

type EditableApplication = Omit<ApplicationCard, "tags">;

const DashboardApplications = () => {
  const [applications, setApplications] = useState<ApplicationCard[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationCard | null>(null);
  const [editingApp, setEditingApp] = useState<ApplicationCard | null>(null);
  const [showCreateApp, setShowCreateApp] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch("/api/applications/recent");
      const data = await res.json();
      setApplications(data);
    };

    fetchApplications();
  }, []);

  const handleEdit = (app: ApplicationCard) => {
    setEditingApp(app);
  };

  const handleSaveEdit = async (app: EditableApplication) => {
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: app.company,
          position: app.position,
          status: app.status,
          appliedDate: app.appliedDate,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        setSelectedApp(null);
      } else {
        console.error("Failed to save edits");
      }
    } catch (err) {
      console.error("Save edit error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting...");

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        toast.success("Application deleted", { id: toastId });
      } else {
        toast.error("Failed to delete application", { id: toastId });
      }
    } catch (err) {
      toast.error("Error deleting application:", { id: toastId });
    }
  };

  const handleView = (app: ApplicationCard) => {
    setSelectedApp(app);
  };

  const handleAddApplication = (newApp: ApplicationCard) => {
    setApplications((prev) => [newApp, ...prev]);
    setShowCreateApp(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Recent Applications</h3>
      <div className="overflow-x-auto">
        <button
          onClick={() => setShowCreateApp(true)}
          className="mb-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded cursor-pointer"
        >
          + Add Application
        </button>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b text-sm text-gray-700">
                <td className="py-2 pr-4">{app.company}</td>
                <td className="py-2 pr-4">{app.position}</td>
                <td className="py-2 pr-4">{app.status}</td>
                <td className="py-2 pr-4">
                  {format(new Date(app.appliedDate), "MMM d, yyyy")}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {app.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 space-x-3">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => handleView(app)}
                  >
                    View
                  </button>
                  <button
                    className="text-indigo-600 hover:underline text-sm"
                    onClick={() => handleEdit(app)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleDelete(app.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <ViewModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {editingApp && (
        <EditModal
          application={editingApp}
          onClose={() => setEditingApp(null)}
          onSave={handleSaveEdit}
        />
      )}

      {showCreateApp && (
        <CreateApplicationModal
          onClose={() => setShowCreateApp(false)}
          onCreate={handleAddApplication}
        />
      )}
    </div>
  );
};

export default DashboardApplications;
