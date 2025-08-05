"use client";

// import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Nav from "@/components/Nav";
import DashboardStats from "@/components/DashboardStats";
import DashboardApplications from "@/components/DashboardApplications";
import DashboardReminders from "@/components/DashboardReminders";

const DashboardPage = () => {
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
