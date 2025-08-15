"use client";

import Nav from "@/components/Nav";
import { useUser } from "@clerk/nextjs";

export default function FeaturesPage() {
  const { isSignedIn } = useUser();

  const features = [
    {
      title: "Visual Dashboard",
      description:
        "Track every application at a glance. See stats like total applications, interviews, offers, and rejections with clear visualization.",
      icon: "📊",
    },
    {
      title: "Automated Reminders",
      description:
        "Get notified before interviews, follow-up deadlines, and key events so you never miss an opportunity.",
      icon: "⏰",
    },
    {
      title: "Tags",
      description:
        "Organize applications by any custom tags to quickly find what you need.",
      icon: "🏷️",
    },
    {
      title: "Progress Tracking",
      description:
        "Follow your journey from applied to offer with clear, easy-to-read progress indicators.",
      icon: "📈",
    },
    {
      title: "Multi-Device Access",
      description:
        "Use JobTrail on desktop, tablet, or mobile — your job hunt stays synced across devices.",
      icon: "💻",
    },
    {
      title: "Secure & Private",
      description:
        "Your data is encrypted and protected so you can focus on landing the job without worrying about privacy.",
      icon: "🔒",
    },
  ];

  return (
    <div>
      <Nav />
      <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Powerful Features to Supercharge Your Job Search
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to track, organize, and succeed in your job
            applications - all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8 text-left hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          {isSignedIn ? (
            <a
              href="/dashboard"
              className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Go to Your Dashboard
            </a>
          ) : (
            <a
              href="/sign-up"
              className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Get Started
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
