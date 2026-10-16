"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiOutlineBookOpen,
  HiOutlineTrophy,
  HiOutlineEnvelope,
} from "react-icons/hi2";

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    {
      title: "Explore Courses",
      description: "Upgrade your skills with our specialized IT training programs.",
      href: "/course",
      icon: <HiOutlineBookOpen className="h-5 w-5 text-primary" />,
    },
    {
      title: "Success Stories",
      description: "Discover inspiring journeys of our successful graduates.",
      href: "/success-story",
      icon: <HiOutlineTrophy className="h-5 w-5 text-primary" />,
    },
    {
      title: "Get in Touch",
      description: "Have questions? Our support team is here to assist you.",
      href: "/contact",
      icon: <HiOutlineEnvelope className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* 404 Badge & Heading */}
        <div className="space-y-4">


          <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-amber-500 to-orange-400 bg-clip-text text-transparent select-none">
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-bold text-base-content tracking-tight">
            Oops! Page Not Found
          </h2>

          <p className="text-base text-base-content/70 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline btn-md gap-2 font-medium border-base-300 hover:border-primary hover:bg-base-200"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="btn btn-primary btn-md gap-2 font-semibold text-white shadow-md hover:shadow-lg transition-all"
          >
            <HiOutlineHome className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>


      </div>
    </div>
  );
}
