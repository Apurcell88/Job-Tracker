"use client";

import { useEffect, useState } from "react";

type Reminder = {
  id: string;
  company: string;
  position: string;
  appliedDate: string; // ISO string date
  followUpDate: string; // ISO string date
};

type Interview = {
  id: string;
  company: string;
  interviewDate: string;
};

const DashboardReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      const res = await fetch("/api/reminders");
      if (res.ok) {
        const data = await res.json();
        setReminders(data); // server already filters within 7 days
      }
    };

    const fetchInterviews = async () => {
      const res = await fetch("/api/interviews");
      if (res.ok) {
        const data = await res.json();
        setInterviews(data);
      }
    };

    fetchReminders();
    fetchInterviews();

    const interval = setInterval(() => {
      fetchReminders();
      fetchInterviews();
    }, 1000); // refresh every 1s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 mt-4 rounded-lg border shadow bg-white">
      <h2 className="text-lg font-semibold mb-4">Upcoming Reminders</h2>

      {/* Follow-Up Reminders */}
      {reminders.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">No upcoming follow-ups.</p>
      ) : (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Follow-Ups</h3>
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
        </div>
      )}

      {/* Interview Reminders */}
      {interviews.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming interviews.</p>
      ) : (
        <div>
          <h3 className="text-md font-medium mb-2">Interviews</h3>
          <ul className="space-y-2">
            {interviews.map((interview) => {
              const date = new Date(interview.interviewDate);
              const isValidDate = !isNaN(date.getTime());

              return (
                <li key={interview.id} className="border p-2 rounded">
                  <div className="font-medium">{interview.company}</div>
                  <div className="text-sm text-gray-600">
                    Interview on:{" "}
                    {isValidDate
                      ? date.toLocaleString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No interview date"}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashboardReminders;
