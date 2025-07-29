"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Tag = {
  id: string;
  name: string;
};

type Application = {
  id: string;
  company: string;
  position: string;
  status: string;
  appliedDate: string;
  tags: Tag[];
};

const DashboardPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (!isSignedIn) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto -4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Job Tracker Dashboard
      </h1>
      <h2>Welcome, {user.firstName}</h2>
      <p>Your email is: {user.emailAddresses[0].emailAddress}</p>
      {loading ? (
        <p>loading...</p>
      ) : applications.length === 0 ? (
        <p>No application found</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app.id} className="border rounded-xl p-4 shadow-sm">
              <h2 className="text-xl font-semibold">
                {app.position} @ {app.company}
              </h2>
              <p className="text-sm text-gray-500">Status: {app.status}</p>
              <p className="text-sm text-gray-500">
                Applied: {new Date(app.appliedDate).toLocaleDateString()}
              </p>
              {app.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;
