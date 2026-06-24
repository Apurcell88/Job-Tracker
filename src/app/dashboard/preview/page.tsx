"use client";

import DashboardApplications from "@/components/DashboardApplications";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardReminders from "@/components/DashboardReminders";
import DashboardStats from "@/components/DashboardStats";
import Nav from "@/components/Nav";
import {
  demoApplications,
  demoInterviews,
  demoReminders,
  demoStats,
} from "@/lib/demoDashboard";

const DashboardPreviewPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <Nav />
        <DashboardHeader readOnly />
        <DashboardStats refreshKey={0} statsOverride={demoStats} />
        <DashboardApplications
          onStatusChange={() => {}}
          initialApplications={demoApplications}
          initialTotal={demoApplications.length}
          readOnly
        />
        <DashboardReminders
          refreshKey={0}
          remindersOverride={demoReminders}
          interviewsOverride={demoInterviews}
          readOnly
        />
      </div>
    </main>
  );
};

export default DashboardPreviewPage;
