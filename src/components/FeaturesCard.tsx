import { FC } from "react";
import React from "react";

type Feature = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Track Everything",
    desc: "Manage applications, interviews, and offers all in one place.",
    icon: (
      <svg
        className="w-10 h-10 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    title: "Set Reminders",
    desc: "Never miss a follow-up with automated notifications.",
    icon: (
      <svg
        className="w-10 h-10 text-teal-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    title: "Visual Dashboard",
    desc: "See your progress with insightful analytics.",
    icon: (
      <svg
        className="w-10 h-10 text-orange-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
  },
  {
    title: "Organize with Tags",
    desc: "Filter and sort applications your way.",
    icon: (
      <svg
        className="w-10 h-10 text-indigo-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M3 12l7-7 7 7-7 7-7-7z" />
      </svg>
    ),
  },
];

const FeaturesCard: FC = () => {
  return (
    <section className="max-w-6xl mx-auto py-20 px-6 md:px-12 lg:px-24 grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, i) => (
        <div key={i} className="text-center">
          <div className="mb-4 flex justify-center">{feature.icon}</div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm">{feature.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default FeaturesCard;
