import React from "react";
import Nav from "@/components/Nav";

const page = () => {
  return (
    <div>
      <Nav />
      <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About <span className="text-indigo-600">JobTrail</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            JobTrail is your all-in-one job application tracker, designed to
            make your job search more organized and less stressful. Whether you
            are a recent graudate, career changer, or seasoned professional,
            JobTrail keeps your applications, interviews and follow-ups in one
            easy-to-manage place.
          </p>
          <ul className="text-left max-w-md mx-auto space-y-4">
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              <span>
                <strong>Visual Dashboard</strong> - See all your applications,
                statuses, and reminders at a glace.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              <span>
                <strong>Automated Reminders</strong> - Never miss a follow-up or
                interview.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              <span>
                <strong>Tags & Filters</strong> - Organize applications your
                way.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              <span>
                <strong>Multi-Device Access</strong> - Track your job hunt
                anytime, anywhere.
              </span>
            </li>
          </ul>
          <p className="mt-8 text-lg text-gray-700">
            With JobTrail, you can focus on preparing for opportunities instead
            of chasing paperwork.
          </p>
        </div>
      </section>
    </div>
  );
};

export default page;
