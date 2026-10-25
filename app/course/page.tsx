import { getCourses, courseResponse } from "@/lib/api/course";
import CourseCard from "@/components/ui/card";

export default async function CoursePage() {
  const data = await getCourses();

  // Safely extract courses from server response
  let courses: courseResponse[] = [];
  if (Array.isArray(data)) {
    courses = data;
  } else if (data && typeof data === "object") {
    courses = (data as { data?: courseResponse[]; courses?: courseResponse[] }).data ||
              (data as { data?: courseResponse[]; courses?: courseResponse[] }).courses || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          Our <span className="text-primary">Courses</span>
        </h1>
        <p className="text-base text-base-content/70 max-w-xl mx-auto">
          Explore cutting-edge courses designed to elevate your technical skills.
        </p>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {courses.map((course) => (
            <CourseCard
              key={course._id || course.id || course.courseName}
              course={course}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-base-200/50 rounded-3xl border border-dashed border-base-300 max-w-lg mx-auto">
          <p className="text-base font-medium text-base-content/70">
            No courses available at the moment.
          </p>
          <p className="text-xs text-base-content/50 mt-1">
            Check back later for newly added courses!
          </p>
        </div>
      )}
    </div>
  );
}
