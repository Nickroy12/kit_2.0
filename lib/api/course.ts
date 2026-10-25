import { serverFetch } from "../core/server";
import type { courseResponse } from "../action";
import { slugify } from "../utils";

export type { courseResponse };

export const getCourses = async <T = courseResponse[]>(): Promise<T | Record<string, never>> => {
  return serverFetch<T>("/app/course");
};

export const fetchCourses = getCourses;

export const getCourseById = async <T = courseResponse>(id: string): Promise<T | Record<string, never>> => {
  return serverFetch<T>(`/app/course/${id}`);
};

function extractSingleCourse(data: unknown): courseResponse | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (obj.courseName && typeof obj.courseName === "string") return obj as unknown as courseResponse;
  if (obj.data && typeof obj.data === "object" && (obj.data as Record<string, unknown>).courseName) {
    return obj.data as courseResponse;
  }
  if (obj.course && typeof obj.course === "object" && (obj.course as Record<string, unknown>).courseName) {
    return obj.course as courseResponse;
  }
  return null;
}

export const getCourseBySlugOrId = async (identifier: string): Promise<courseResponse | null> => {
  if (!identifier) return null;

  // 1. If identifier contains "--", extract the ID part
  const actualId = identifier.includes("--") ? identifier.split("--").pop()! : identifier;

  // 2. If it is a 24-char hex MongoDB ObjectId, fetch directly
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(actualId);
  if (isMongoId) {
    try {
      const res = await getCourseById(actualId);
      const course = extractSingleCourse(res);
      if (course) return course;
    } catch {
      // Fallback
    }
  }

  // 3. Otherwise find in all courses by matching slug or courseName
  try {
    const allData = await getCourses();
    let courses: courseResponse[] = [];
    if (Array.isArray(allData)) {
      courses = allData;
    } else if (allData && typeof allData === "object") {
      const obj = allData as { data?: courseResponse[]; courses?: courseResponse[] };
      courses = obj.data || obj.courses || [];
    }

    const cleanIdentifier = decodeURIComponent(identifier).toLowerCase().trim();

    return (
      courses.find((c) => {
        const courseId = c._id || c.id;
        if (courseId === actualId || courseId === identifier) return true;
        const cSlug = c.slug ? c.slug.toLowerCase().trim() : slugify(c.courseName || "");
        return cSlug === cleanIdentifier || slugify(c.courseName || "") === cleanIdentifier;
      }) || null
    );
  } catch {
    return null;
  }
};

