JobTrail – Job Application Tracker

JobTrail is a full-stack job tracking application built with Next.js, Prisma, and PostgreSQL. It helps you organize your job search with features like application tracking, reminders, status updates, and analytics.

🚀 Features

Track Applications – Add job applications with details like position, company, status, and follow-up dates.

Reminders – Get notified about interviews and follow-ups.

Tags & Filters – Organize and search your applications easily.

Visual Dashboard – View statistics for total applications, interviews, offers, and rejections.

Authentication – Secure login with Email/Password, Google, or GitHub (NextAuth).

Responsive UI – Built with Tailwind CSS for mobile-first design.

🛠 Tech Stack

Frontend:

Next.js (App Router)

Tailwind CSS

shadcn/ui

Backend:

Prisma ORM

PostgreSQL (Neon hosting)

NextAuth.js for authentication

Deployment:

Vercel for hosting
Neon for database

Set up environment variables

Create a .env file in the project root:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"

Set up the database
npx prisma migrate dev
npx prisma generate

Start the development server
npm run dev

🌐 Deployment Notes (Vercel + Prisma)

Vercel caches node_modules, so Prisma Client might be outdated during builds.
To avoid this, update Vercel Build Settings:

Build Command:

npx prisma generate && next build


Also, add this to package.json to regenerate Prisma Client automatically:

"scripts": {
  "postinstall": "prisma generate",
  "build": "next build"
}


Ensure @prisma/client is in dependencies (not devDependencies).

📜 License

This project is licensed under the MIT License.

👤 Author

Adam Purcell – GitHub • LinkedIn
