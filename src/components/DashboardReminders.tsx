"use client";

import { useEffect, useState } from "react";

type Reminder = {
  id: string;
  company: string;
  position: string;
  appliedDate: string; // ISO string date
  followUpDate: string; // ISO string date
};

const DashboardReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      const res = await fetch("/api/reminders");
      if (res.ok) {
        const data = await res.json();
        setReminders(data); // server already filters within 7 days
      }
    };

    fetchReminders();

    const interval = setInterval(fetchReminders, 10000); // every 10 secs

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 mt-4 rounded-lg border shadow bg-white">
      <h2 className="text-lg font-semibold mb-4">Upcoming Reminders</h2>
      {reminders.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming reminders.</p>
      ) : (
        <ul className="space-y-2">
          {reminders.map((app) => {
            const followDate = new Date(app.followUpDate);
            const isValidDate = !isNaN(followDate.getTime());

            return (
              <li key={app.id} className="border p-2 rounded">
                <div className="font-medium">
                  {app.company} - {app.position}
                </div>
                <div className="text-sm text-gray-600">
                  Follow up on:{" "}
                  {isValidDate
                    ? followDate.toLocaleDateString()
                    : "No follow-up date"}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DashboardReminders;
