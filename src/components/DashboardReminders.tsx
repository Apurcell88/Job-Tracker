"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

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

type Props = {
  refreshKey: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DashboardReminders = ({ refreshKey }: Props) => {
  const {
    data,
    error: remindersError,
    isLoading: remindersLoading,
    mutate: refetchReminders,
  } = useSWR<{ upcoming: Reminder[]; overdue: Reminder[] }>(
    "/api/reminders",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  const {
    data: interviews,
    error: interviewsError,
    isLoading: interviewsLoading,
    mutate: refetchInterviews,
  } = useSWR<Interview[]>("/api/interviews", fetcher, {
    // refreshInterval: 60000, // optional
    revalidateOnFocus: true,
  });

  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    refetchReminders();
    setShowAlerts(true);
  }, [refreshKey, refetchReminders]);

  if (remindersLoading || interviewsLoading) return <div>Loading...</div>;
  if (remindersError || interviewsError) return <div>Error loading data.</div>;

  const { upcoming = [], overdue = [] } = data || {};

  // Calculate today's range for interviews today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Critical overdue follow-ups (already overdue)
  const criticalOverdue = overdue.filter((app) => {
    const followUpDate = new Date(app.followUpDate);
    return followUpDate < today;
  });

  // Interviews happening today
  const interviewsToday =
    interviews?.filter((interview) => {
      const interviewDate = new Date(interview.interviewDate);
      return interviewDate >= today && interviewDate < tomorrow;
    }) || [];

  const markComplete = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}/follow-up-complete`, {
        method: "PATCH",
      });
      if (res.ok) {
        toast.success("Follow-up marked complete");
        refetchReminders();
      } else {
        toast.error("Failed to makr complete");
      }
    } catch (err) {
      toast.error("Error marking complete");
    }
  };

  return (
    <div className="p-4 mt-4 rounded-lg border shadow bg-white">
      {/* Notification Center */}
      <div
        className={`space-y-3 mb-6 transition-opacity duration-700 ${
          showAlerts ? "opacity-100" : "opacity-0"
        }`}
      >
        {criticalOverdue.length > 0 && (
          <div className="flex items-center gap-3 bg-red-100 border border-red-400 text-red-700 p-4 rounded shadow animate-pulse">
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
              />
            </svg>
            <p className="font-semibold text-lg">
              You have {criticalOverdue.length} overdue follow-up
              {criticalOverdue.length > 1 ? "s" : ""}! Please check them.
            </p>
          </div>
        )}

        {interviewsToday.length > 0 && (
          <div className="flex items-center gap-3 bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded shadow animate-pulse">
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z"
              />
            </svg>
            <p className="font-semibold text-lg">
              You have {interviewsToday.length} interview
              {interviewsToday.length > 1 ? "s" : ""} scheduled for today.
            </p>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">Upcoming Reminders</h2>

      {/* Follow-Up Reminders */}
      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">No upcoming follow-ups.</p>
      ) : (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Follow-Ups</h3>
          <ul className="space-y-2">
            {upcoming.map((app) => {
              const followDate = new Date(app.followUpDate);
              const isValidDate = !isNaN(followDate.getTime());
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isOverdue = isValidDate && followDate < today;

              return (
                <li key={app.id} className="border p-2 rounded">
                  <div className="font-medium">
                    {app.company} - {app.position}
                    {isOverdue && (
                      <span className="ml-2 text-red-600 font-semibold">
                        ⚠ Overdue
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Follow up on:{" "}
                    {isValidDate
                      ? followDate.toLocaleDateString()
                      : "No follow-up date"}
                  </div>
                  <button
                    onClick={() => markComplete(app.id)}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Mark as Complete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Overdue Follow-Ups */}
      {overdue.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">No overdue follow-ups.</p>
      ) : (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2 text-red-600">
            Overdue Follow-Ups
          </h3>
          <ul className="space-y-2">
            {overdue.map((app) => (
              <li key={app.id} className="border p-2 rounded bg-red-50">
                <div className="font-medium">
                  {app.company} - {app.position}
                  <span className="ml-2 text-red-600 font-semibold">
                    ⚠ Overdue
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Follow up was due on:{" "}
                  {new Date(app.followUpDate).toLocaleDateString()}
                </div>
                <button
                  onClick={() => markComplete(app.id)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Mark as Complete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interview Reminders */}
      {interviews?.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming interviews.</p>
      ) : (
        <div>
          <h3 className="text-md font-medium mb-2">Interviews</h3>
          <ul className="space-y-2">
            {interviews?.map((interview) => {
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
