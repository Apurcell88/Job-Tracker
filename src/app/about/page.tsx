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
