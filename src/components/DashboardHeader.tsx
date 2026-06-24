"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

type Props = {
  readOnly?: boolean;
};

const DashboardHeader = ({ readOnly = false }: Props) => {
  const { user, isSignedIn } = useUser();

  if (readOnly) {
    return (
      <header className="flex flex-col gap-2 p-4 border-b border-gray-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
          Read-only preview
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          JobTrail sample dashboard
        </h1>
        <p className="max-w-2xl text-sm text-gray-600">
          Explore the dashboard with sample applications. Editing, deleting,
          and status changes are disabled in this preview.
        </p>
      </header>
    );
  }

  if (!isSignedIn || !user) return null;

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      <h1>
        Welcome back, {user.firstName}{" "}
        <span role="img" aria-label="wave">
          👋
        </span>
      </h1>
    </header>
  );
};

export default DashboardHeader;
