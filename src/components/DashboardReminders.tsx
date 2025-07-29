"use client";

const reminders = [
  // dummy data
  { id: 1, title: "Google Interview", date: "Aug 3, 2025" },
  { id: 2, title: "Follow up with Meta", date: "Aug 4, 2025 " },
];

const DashboardReminders = () => {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Upcoming Reminders
      </h2>
      <ul className="bg-white shadow-sm rounded-lg divide-y">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {reminder.title}
              </span>
              <span className="text-sm text-gray-500">{reminder.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DashboardReminders;
