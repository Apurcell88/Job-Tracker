"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, SignOutButton } from "@clerk/nextjs";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/resources", label: "Resources" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-600">JobTrail</div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-1 py-2 font-medium ${
                pathname === href
                  ? "text-indigo-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-indigo-600 after:rounded-full"
                  : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Sign In / Out Button */}
          {isSignedIn ? (
            <SignOutButton>
              <button className="text-sm font-medium text-red-500 hover:underline">
                Sign Out
              </button>
            </SignOutButton>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 relative">
            <span
              className={`block absolute h-0.5 w-6 bg-indigo-600 transform transition duration-300 ease-in-out ${
                open ? "rotate-45 top-2.5" : "top-1"
              }`}
            />
            <span
              className={`block absolute h-0.5 w-6 bg-indigo-600 transition-opacity duration-300 ease-in-out ${
                open ? "opacity-0" : "top-3"
              }`}
            />
            <span
              className={`block absolute h-0.5 w-6 bg-indigo-600 transform transition duration-300 ease-in-out ${
                open ? "-rotate-45 top-2.5" : "top-5"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white shadow-md absolute w-full left-0 top-16 overflow-hidden transition-max-height duration-300 ease-in-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-4 py-4 space-y-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block font-medium text-lg ${
                pathname === href
                  ? "text-indigo-600"
                  : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Sign In / Out Button */}
          {isSignedIn ? (
            <SignOutButton>
              <button
                onClick={() => setOpen(false)}
                className="text-left text-lg font-medium text-red-500"
              >
                Sign Out
              </button>
            </SignOutButton>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="block font-medium text-lg text-gray-700 hover:text-indigo-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
