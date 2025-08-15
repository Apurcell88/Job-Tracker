"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const DashboardHeader = () => {
  const { user, isSignedIn } = useUser();

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
