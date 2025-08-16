import Nav from "@/components/Nav";
import FeaturesCard from "@/components/FeaturesCard";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col pt-16">
      <Nav />
      {/* Hero Section */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto">
        <div className="md:w-1/2 max-w-xl text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-6">
            Track your job applications effortlessly with JobTrail
          </h1>
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            Stay organized, get reminders, and land your dream job faster.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Get Started Free
            </a>
            <a
              href="/features"
              className="px-6 py-3 border border-teal-500 text-teal-500 rounded-md font-semibold hover:bg-teal-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          {/* Placeholder for image or screenshot */}
          <div className="flex items-center justify-center md:ml-6">
            <img
              src="images/job-trail.png"
              alt="JobTrail dashboard preview"
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <FeaturesCard />
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16 px-6 md:px-12 lg:px-24 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">
          Ready to organize your job search?
        </h2>
        <p className="mb-8 max-w-xl mx-auto">
          Join thousands of job seekers using JobTrail to stay on top of their
          applications.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          Get Started Free
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} JobTrail. All rights reserved.
      </footer>
    </main>
  );
}
