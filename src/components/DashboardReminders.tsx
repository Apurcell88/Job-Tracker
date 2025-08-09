"use client";

import { useEffect } from "react";
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
    data: reminders,
    error: remindersError,
    isLoading: remindersLoading,
    mutate: refetchReminders,
  } = useSWR<Reminder[]>("/api/reminders", fetcher, {
    revalidateOnFocus: true,
  });

  const {
    data: interviews,
    error: interviewsError,
    isLoading: interviewsLoading,
    mutate: refetchInterviews,
  } = useSWR<Interview[]>("/api/interviews", fetcher, {
    // refreshInterval: 60000, // optional
    revalidateOnFocus: true,
  });

  useEffect(() => {
    refetchReminders();
  }, [refreshKey, refetchReminders]);

  if (remindersLoading || interviewsLoading) return <div>Loading...</div>;
  if (remindersError || interviewsError) return <div>Error loading data.</div>;

  return (
    <div className="p-4 mt-4 rounded-lg border shadow bg-white">
      <h2 className="text-lg font-semibold mb-4">Upcoming Reminders</h2>

      {/* Follow-Up Reminders */}
      {reminders?.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">No upcoming follow-ups.</p>
      ) : (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Follow-Ups</h3>
          <ul className="space-y-2">
            {reminders?.map((app) => {
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
