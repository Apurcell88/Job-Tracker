"use client";

import { useEffect, useState } from "react";
import { Application, Status } from "@/generated/prisma";
import { format } from "date-fns";

type ApplicationCard = {
  id: string;
  company: string;
  position: string;
  status: Status;
  appliedDate: string;
};

const DashboardApplications = () => {
  const [applications, setApplications] = useState<ApplicationCard[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch("/api/applications/recent");
      const data = await res.json();
      setApplications(data);
    };

    fetchApplications();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Recent Applications</h3>
      <div className="overflow-x-auto">
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
                <td className="py-2">
                  <button className="text-indigo-600 hover:underline text-sm">
                    Edit
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
    </div>
  );
};

export default DashboardApplications;
