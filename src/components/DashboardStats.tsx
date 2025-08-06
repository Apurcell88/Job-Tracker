"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Stats = {
  total: number;
  interviews: number;
  offers: number;
  rejections: number;
};

type Props = {
  refreshKey: number;
};

const DashboardStats = ({ refreshKey }: Props) => {
  const { user } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      const res = await fetch(`/api/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    };

    fetchStats();
  }, [user, refreshKey]);

  if (!stats) return null;

  const displayStats = [
    { label: "Total Apps", value: stats.total },
    { label: "Interviews", value: stats.interviews },
    { label: "Offers", value: stats.offers },
    { label: "Rejections", value: stats.rejections },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {displayStats.map((stat) => (
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
