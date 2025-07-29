"use client";

const stats = [
  // hardcoded for now. Replace later with dynamic data
  { label: "Total Apps", value: 12 },
  { label: "Interrviews", value: 4 },
  { label: "Offers", value: 2 },
  { label: "Rejections", value: 3 },
];

const DashboardStats = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white shadow rounded-xl p-4 text-center border"
        >
          <p className="text-2-xl font-bold text-indigo-600">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </section>
  );
};

export default DashboardStats;
