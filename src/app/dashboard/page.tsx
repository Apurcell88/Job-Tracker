"use client";

// import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Nav from "@/components/Nav";
import DashboardStats from "@/components/DashboardStats";
import DashboardApplications from "@/components/DashboardApplications";
import DashboardReminders from "@/components/DashboardReminders";

// type Tag = {
//   id: string;
//   name: string;
// };

// type Application = {
//   id: string;
//   company: string;
//   position: string;
//   status: string;
//   appliedDate: string;
//   tags: Tag[];
// };

const DashboardPage = () => {
  // const [applications, setApplications] = useState<Application[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchApplications = async () => {
  //     try {
  //       const res = await fetch("/api/applications");
  //       const data = await res.json();
  //       setApplications(data);
  //     } catch (err) {
  //       console.error("Error fetching applications:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchApplications();
  // }, []);
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <Nav />
        <DashboardHeader />
        <DashboardStats />
        <DashboardApplications />
        <DashboardReminders />
      </div>
    </main>
  );
};

export default DashboardPage;
