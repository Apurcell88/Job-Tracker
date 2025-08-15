"use client";

import { useState } from "react";
import Nav from "./Nav";

type Resource = {
  id: string;
  title: string;
  description: string;
  tag: string;
  link: string;
  action: string;
};

const ResourcesPage = () => {
  const [selectedTag, setSelectedTag] = useState<string | "All">("All");

  const resources: Resource[] = [
    {
      id: "1",
      title: "Indeed - Resume Templates",
      description:
        "Professionally designed resume templates and tips for all industries.",
      tag: "Resume",
      link: "https://www.indeed.com/career-advice/resume-samples",
      action: "View",
    },
    {
      id: "2",
      title: "Indeed - Cover Letter Samples",
      description:
        "Examples of cover letters tailored for various job positions.",
      tag: "Cover Letter",
      link: "https://www.indeed.com/career-advice/cover-letter-samples",
      action: "View",
    },
    {
      id: "3",
      title: "The Interview Guys - Interview Tips",
      description:
        "Free guides, sample questions, and strategies to ace your interviews.",
      tag: "Interview",
      link: "https://www.theinterviewguys.com/interview-questions/",
      action: "View",
    },
    {
      id: "4",
      title: "LinkedIn Learning - Networking Tips",
      description: "Learn how to build your professional network effectively.",
      tag: "Networking",
      link: "https://www.linkedin.com/learning/topics/networking",
      action: "View",
    },
    {
      id: "5",
      title: "Canva - Job Application Templates",
      description:
        "Design your own resumes, cover letters, and portfolio pages.",
      tag: "Tools",
      link: "https://www.canva.com/resumes/templates/",
      action: "View",
    },
  ];

  const tags = ["All", ...Array.from(new Set(resources.map((r) => r.tag)))];

  const filteredResources =
    selectedTag === "All"
      ? resources
      : resources.filter((r) => r.tag === selectedTag);

  return (
    <div>
      <Nav />
      <div className="p-8 mt-10">
        <h1 className="text-2xl font-bold mb-4">Resources</h1>

        {/* Tag filter buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full border ${
                selectedTag === tag
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((r) => (
            <a
              key={r.id}
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg mb-1">{r.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{r.description}</p>
              <span className="inline-block text-xs bg-gray-200 px-2 py-1 rounded">
                {r.tag}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
