"use client";

import React from "react";
import Link from "next/link";
import type { courseResponse } from "@/lib/api/course";
import { slugify } from "@/lib/utils";

export interface CourseCardProps {
  course: courseResponse;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  className = "",
}) => {
  const { courseName, image, description, price, discount, _id, id } = course;
  const courseId = _id || id;
  const slug = slugify(courseName);
  const detailHref = slug ? `/course/Details/${slug}` : (courseId ? `/course/Details/${courseId}` : "");

  return (
    <div
      className={`group w-full max-w-sm rounded-[24px]  bg-orange-300 border border-slate-200/70 dark:border-white/10 shadow-sm hover:shadow-md p-3.5 flex flex-col justify-between transition-all duration-200 ${className}`}
    >
      <div>
        {/* Course Thumbnail */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5">
          <img
            src={image}
            alt={courseName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="px-1.5 pt-3.5 space-y-2">
          <h3 className="text-lg font-bold text-slate-900  line-clamp-1">
            {courseName}
          </h3>

          {description && (
            <p className="text-xs line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Footer: Price & CTA */}
      <div className="px-1.5 pt-4 mt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
        <div>
          {price !== undefined && price !== null ? (
            <div className="flex items-baseline gap-1.5">
              {discount ? (
                <>
                  <span className="text-base font-bold text-black">
                    ৳{discount}
                  </span>
                  <span className="text-xs  line-through">
                    ৳{price}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-black">
                  ৳{price}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-semibold text-emerald-600">Free</span>
          )}
        </div>

        {courseId ? (
          <Link
            href={detailHref}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-black bg-white hover:opacity-90 transition-opacity"
          >
            See More
          </Link>
        ) : (
          <button
            type="button"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-primary hover:opacity-90 transition-opacity"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;