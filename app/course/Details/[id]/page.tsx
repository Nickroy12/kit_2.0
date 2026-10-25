import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Laptop, 
  HelpCircle 
} from "lucide-react";
import { getCourseBySlugOrId, courseResponse } from "@/lib/api/course";

interface CourseDetailsProps {
  params: Promise<{ id: string }>;
}

// Helper to extract course data from potential response structures
function extractCourseData(res: unknown): courseResponse | null {
  if (!res || typeof res !== "object") return null;
  const obj = res as Record<string, unknown>;

  if (obj.courseName && typeof obj.courseName === "string") {
    return obj as unknown as courseResponse;
  }
  if (obj.data && typeof obj.data === "object" && (obj.data as Record<string, unknown>).courseName) {
    return obj.data as courseResponse;
  }
  if (obj.course && typeof obj.course === "object" && (obj.course as Record<string, unknown>).courseName) {
    return obj.course as courseResponse;
  }
  return null;
}

// Parses inline **bold text**
function renderInlineContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Formats description: ## & ### as bold headings, ** as bullet dots
function FormattedDescription({ content }: { content?: string }) {
  if (!content) {
    return <p className="text-slate-500 italic">No description provided for this course yet.</p>;
  }

  const lines = content.split(/\r?\n/);

  return (
    <div className="space-y-2 text-slate-700 text-sm sm:text-base leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // ### Subheading (Bold)
        if (/^###\s*/.test(trimmed)) {
          const text = trimmed.replace(/^###\s*/, "");
          return (
            <h4 key={idx} className="text-base sm:text-lg font-bold text-slate-900 pt-3 pb-1">
              {renderInlineContent(text)}
            </h4>
          );
        }

        // ## Heading (Bold)
        if (/^##\s*/.test(trimmed)) {
          const text = trimmed.replace(/^##\s*/, "");
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 pt-4 pb-1">
              {renderInlineContent(text)}
            </h3>
          );
        }

        // Bullet / Dot point (Starts with ** , * , - , or •)
        if (
          trimmed.startsWith("** ") ||
          trimmed.startsWith("* ") ||
          trimmed.startsWith("- ") ||
          trimmed.startsWith("• ") ||
          (trimmed.startsWith("**") && !trimmed.endsWith("**"))
        ) {
          const itemText = trimmed.replace(/^(\*\*\s*|\*\s+|-\s+|•\s+)/, "");
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-slate-700 flex-1">{renderInlineContent(itemText)}</span>
            </div>
          );
        }

        // Regular paragraph / text line
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineContent(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default async function CourseDetailsPage({ params }: CourseDetailsProps) {
  const { id } = await params;
  const course = await getCourseBySlugOrId(id);

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">
            We couldn't locate details for this course. It might have been removed or the ID is incorrect.
          </p>
          <Link
            href="/course"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const { courseName, description, image, price, discount } = course;
  const hasDiscount = discount !== null && discount !== undefined && discount < price;
  const discountPercent = hasDiscount && price > 0 ? Math.round(((price - discount) / price) * 100) : null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/course"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all courses</span>
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Course Main Information */}
          <div className="order-2 lg:order-1 lg:col-span-8 space-y-8">
            {/* Header info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Premium Course
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <Laptop className="w-3.5 h-3.5 text-slate-500" />
                  Online Self-Paced
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                {courseName}
              </h1>

              {/* Quick perks bar */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary shrink-0" />
                  <span>Hands-on Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span>Certificate Included</span>
                </div>
              </div>
            </div>

            {/* Course Overview / Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Course Overview</h2>
              <FormattedDescription content={description} />
            </div>

            {/* What you'll learn */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-slate-900">What You'll Learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  "In-depth core concepts and real-world techniques",
                  "Industry-standard practical project implementations",
                  "Best practices, code architecture, and optimization",
                  "Troubleshooting, debugging, and production readiness",
                  "Step-by-step guidance tailored for all skill levels",
                  "Direct instructor guidance and community support"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Target Audience */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Basic computer and internet browsing knowledge.
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    A PC or laptop with internet access.
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Eagerness to learn and practice regularly.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enrollment & Summary Card */}
          <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg overflow-hidden">
              {/* Thumbnail Image */}
              {image ? (
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-5">
                  <img
                    src={image}
                    alt={courseName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {discountPercent && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>
              ) : null}

              {/* Price section */}
              <div className="mb-5 pb-5 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Tuition Fee
                </span>
                <div className="flex items-baseline gap-2">
                  {price !== undefined && price !== null ? (
                    hasDiscount ? (
                      <>
                        <span className="text-3xl font-extrabold text-primary">
                          ৳{discount}
                        </span>
                        <span className="text-base font-medium text-slate-400 line-through">
                          ৳{price}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-primary">
                        ৳{price}
                      </span>
                    )
                  ) : (
                    <span className="text-2xl font-bold text-emerald-600">Free</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  className="w-full py-3.5 px-6 rounded-2xl text-center text-sm font-semibold text-white bg-primary hover:opacity-95 shadow-md shadow-primary/25 transition-all transform active:scale-[0.98]"
                >
                  Enroll in Course
                </button>
                <Link
                  href="/course"
                  className="block w-full py-2.5 px-6 rounded-2xl text-center text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Browse Other Courses
                </Link>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  This course includes:
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-primary shrink-0" />
                    <span>Access on desktop, tablet, and mobile</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-primary shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>Safe and verified curriculum</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
