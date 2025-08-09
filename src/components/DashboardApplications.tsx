"use client";

import { useEffect, useState } from "react";
import { mutate } from "swr";
import { differenceInCalendarDays, format } from "date-fns";
import { toast } from "react-hot-toast";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import CreateApplicationModal from "./CreateApplicationModal";
import InterviewModal from "./InterviewModal";
import { ApplicationCard } from "../../types";
import { Status } from "@/generated/prisma";

const statusOptions: Status[] = [
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "ARCHIVED",
];

type ApiResponse = {
  total: number;
  recentApplications: ApplicationCard[];
};

type EditableApplication = Omit<ApplicationCard, "tags"> & {
  tags: { name: string }[];
};

type Props = {
  onStatusChange: () => void;
};

const DashboardApplications = ({ onStatusChange }: Props) => {
  const [applications, setApplications] = useState<ApplicationCard[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedApp, setSelectedApp] = useState<ApplicationCard | null>(null);
  const [editingApp, setEditingApp] = useState<ApplicationCard | null>(null);
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [pendingAppId, setPendingAppId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch("/api/applications/recent");
      const data: ApiResponse = await res.json();
      setApplications(data.recentApplications);
      setTotalApplications(data.total);
    };

    fetchApplications();
  }, []);

  const normalizedApplications = Array.isArray(applications)
    ? applications
    : [];

  const filteredApps = selectedTag
    ? normalizedApplications.filter(
        (app) =>
          Array.isArray(app.tags) &&
          app.tags.some((tag) => tag.name === selectedTag)
      )
    : normalizedApplications;

  const allTags = Array.from(
    new Set(
      normalizedApplications.flatMap(
        (app) => app.tags?.map((tag) => tag.name) ?? []
      )
    )
  );

  const fetchRecentApplications = async () => {
    const res = await fetch("/api/applications/recent");
    const data: ApiResponse = await res.json();
    setApplications(data.recentApplications);
    setTotalApplications(data.total);
  };

  const fetchAllApplications = async () => {
    const res = await fetch("/api/applications/all");
    const data: ApplicationCard[] = await res.json();
    setApplications(data);
  };

  const handleToggleShow = async () => {
    if (showAll) {
      await fetchRecentApplications();
    } else {
      await fetchAllApplications();
    }
    setShowAll(!showAll);
  };

  useEffect(() => {
    fetchRecentApplications();
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
          tags: app.tags,
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

  const handleDelete = async (id: string, status: Status) => {
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
        const resRecent = await fetch("/api/applications/recent");
        const data = await resRecent.json();
        // setApplications((prev) => prev.filter((app) => app.id !== id));
        setApplications(data.recentApplications);
        setTotalApplications(data.total);

        toast.success("Application deleted", { id: toastId });
        onStatusChange();

        if (status === "INTERVIEWING") {
          await mutate("/api/interviews"); // revalidate interviews data
        }
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

  const handleAddApplication = async (newApp: ApplicationCard) => {
    setApplications((prev) => [newApp, ...prev].slice(0, 5));
    setShowCreateApp(false);
    onStatusChange();
  };

  const updateStatus = async (
    applicationId: string,
    status: Status,
    interviewDate?: string,
    followUpDate?: string
  ) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, interviewDate, followUpDate }),
      });

      if (!res.ok) {
        throw new Error(`Status update failed: ${res.status}`);
      }

      console.log("Status updated successfully");
      onStatusChange();

      if (status === "INTERVIEWING") {
        await mutate("/api/interviews");
      }

      if (followUpDate) {
        const diff = differenceInCalendarDays(
          new Date(followUpDate),
          new Date()
        );
        if (diff >= 0 && diff <= 7) {
          await mutate(
            "/api/reminders",
            async () => {
              const res = await fetch("/api/reminders");
              return res.json();
            },
            false
          );
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: Status
  ) => {
    if (!applicationId || !newStatus) {
      console.error("Missing applicationId or newStatus");
      return;
    }

    const oldApp = applications.find((app) => app.id === applicationId);
    const oldStatus: Status | undefined = oldApp?.status;

    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );

    if (newStatus === "INTERVIEWING") {
      setPendingAppId(applicationId);
      setShowInterviewModal(true);
      return;
    }

    await updateStatus(applicationId, newStatus);

    // If status changed from INTERVIEWING to something else,
    // refresh interviews so the app disappears from interviews list
    if (oldStatus === "INTERVIEWING" && newStatus !== "INTERVIEWING") {
      await mutate("/api/interviews");
    }
  };

  const handleInterviewConfirm = async (dateTime: string) => {
    if (pendingAppId) {
      await updateStatus(pendingAppId, "INTERVIEWING", dateTime);
      setPendingAppId(null);
      setShowInterviewModal(false);
    }
  };

  const handleInterviewCancel = () => {
    setPendingAppId(null);
    setShowInterviewModal(false);
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
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="font-medium text-gray-700">Filter by Tag:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedTag === tag
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTag && (
            <button
              key="clear-filter"
              onClick={() => setSelectedTag(null)}
              className="ml-2 px-3 py-1 rounded-full text-sm text-gray-600 border hover:bg-gray-100"
            >
              Clear Filter
            </button>
          )}
        </div>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Tags</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <tr key={app.id} className="border-b text-sm text-gray-700">
                <td className="py-2 pr-4">{app.company}</td>
                <td className="py-2 pr-4">{app.position}</td>
                <td className="py-2 pr-4">
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app.id, e.target.value as Status)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-4">
                  {format(new Date(app.appliedDate), "MMM d, yyyy")}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {app.tags?.map((tag) => (
                      <span
                        key={tag.id || tag.name}
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
                    onClick={() => handleDelete(app.id, app.status)}
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
        {totalApplications > 5 && (
          <button
            onClick={handleToggleShow}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            {showAll ? "Show Recent" : "Show All"}
          </button>
        )}
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

      {showInterviewModal && (
        <InterviewModal
          onConfirm={handleInterviewConfirm}
          onCancel={handleInterviewCancel}
        />
      )}
    </div>
  );
};

export default DashboardApplications;
