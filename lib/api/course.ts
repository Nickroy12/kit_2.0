import { serverFetch, serverMutation, serverDelete, serverPatch } from "../core/server";
import type { courseResponse, FinalCourseFormData } from "../action";
import { slugify } from "../utils";

export type { courseResponse, FinalCourseFormData };

// Shape the server returns: { success: true, message: string, result: UpdateResult }
interface PatchCourseResponse {
  success: boolean;
  message: string;
  result: unknown;
}

/**
 * PATCH /app/course/:id
 * Sends only the changed fields — server does $set: req.body in MongoDB.
 * Returns the updated course by merging the sent data (server echoes
 * matchedCount/modifiedCount, not the full document, so we reconstruct).
 */
export const updateCourse = async (
  id: string,
  data: Partial<FinalCourseFormData>
): Promise<courseResponse> => {
  const res = await serverPatch<PatchCourseResponse, Partial<FinalCourseFormData>>(
    `/app/course/${id}`,
    data
  );

  if (!res.success) {
    throw new Error(res.message || "Course update failed");
  }

  // Server returns the MongoDB UpdateResult, not the full document.
  // We return the patched fields merged so the UI can update optimistically.
  return { _id: id, ...data } as courseResponse;
};

export const deleteCourse = async (id: string): Promise<void> => {
  // Uses serverDelete (no body) to match:
  // app.delete('/app/course/:id', ...) — server reads req.params.id only
  await serverDelete(`/app/course/${id}`);
};

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

