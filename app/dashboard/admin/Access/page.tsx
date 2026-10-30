import React from "react";
import { getCourses } from "@/lib/api/course";
import type { courseResponse } from "@/lib/api/course";
import CourseTable from "./_components/CourseTable";

export default async function AccessPage() {
  const data = await getCourses();
  const courses: courseResponse[] = Array.isArray(data) ? data : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Course Access Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      <CourseTable initialCourses={courses} />
    </div>
  );
}
