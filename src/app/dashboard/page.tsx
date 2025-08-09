"use client";

// import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Nav from "@/components/Nav";
import DashboardStats from "@/components/DashboardStats";
import DashboardApplications from "@/components/DashboardApplications";
import DashboardReminders from "@/components/DashboardReminders";
import { useState } from "react";

const DashboardPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <Nav />
        <DashboardHeader />
        <DashboardStats refreshKey={refreshKey} />
        <DashboardApplications
          onStatusChange={() => setRefreshKey((k) => k + 1)}
        />
        <DashboardReminders refreshKey={refreshKey} />
      </div>
    </main>
  );
};

export default DashboardPage;
