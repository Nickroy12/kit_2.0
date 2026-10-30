"use client";

import React, { useState, useTransition, useRef } from "react";
import type { courseResponse, FinalCourseFormData } from "@/lib/api/course";
import { updateCourse, deleteCourse } from "@/lib/api/course";
import { uploadImage } from "@/lib/core/imgbb";
import { useRouter } from "next/navigation";

// ─── Icons ────────────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-.707.414L7 17l.758-4.121A2 2 0 019 12.293z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M3.75 6h16.5A1.5 1.5 0 0121.75 7.5v9A1.5 1.5 0 0120.25 18H3.75A1.5 1.5 0 012.25 16.5v-9A1.5 1.5 0 013.75 6z" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  initialCourses: courseResponse[];
}

type EditForm = {
  courseName: string;
  description: string;
  image: string;
  price: string;
  discount: string;
  discountEnabled: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CourseTable({ initialCourses }: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState<courseResponse[]>(initialCourses);
  const [isPending, startTransition] = useTransition();

  // ── Edit state ──────────────────────────────────────────────────────────────
  const [editTarget, setEditTarget] = useState<courseResponse | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editError, setEditError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Delete state ────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<courseResponse | null>(null);

  // ── Toast state ─────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Open edit modal ────────────────────────────────────────────────────────
  const openEdit = (course: courseResponse) => {
    setEditTarget(course);
    setEditError("");
    setImageFile(null);
    // Always show the existing imgbb image URL as preview
    setImagePreview(course.image ?? "");
    setEditForm({
      courseName: course.courseName,
      description: course.description,
      image: course.image ?? "",
      price: String(course.price),
      discount: course.discount != null ? String(course.discount) : "",
      discountEnabled: course.discountEnabled ?? false,
    });
  };

  // ─── Image file picker ──────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ─── Submit edit ────────────────────────────────────────────────────────────
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editForm) return;

    const id = editTarget._id ?? editTarget.id;
    if (!id) { setEditError("Course ID missing."); return; }

    setEditError("");

    try {
      let imageUrl = editForm.image;

      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadImage(imageFile);
        setIsUploading(false);
      }

      const payload: Partial<FinalCourseFormData> = {
        courseName: editForm.courseName.trim(),
        description: editForm.description.trim(),
        image: imageUrl,
        price: parseFloat(editForm.price) || 0,
        discount:
          editForm.discountEnabled && editForm.discount !== ""
            ? parseFloat(editForm.discount)
            : null,
        discountEnabled: editForm.discountEnabled,
      };

      const updated = await updateCourse(id, payload);

      setCourses((prev) =>
        prev.map((c) => ((c._id ?? c.id) === id ? { ...c, ...updated } : c))
      );
      setEditTarget(null);
      showToast("Course updated successfully.");
      startTransition(() => router.refresh());
    } catch (err) {
      setIsUploading(false);
      setEditError(err instanceof Error ? err.message : "Update failed.");
    }
  };

  // ─── Confirm delete ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id ?? deleteTarget.id;
    if (!id) return;

    try {
      await deleteCourse(id);

      showToast("Course deleted.");
      startTransition(() => router.refresh());
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed.", false);
      setDeleteTarget(null);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
            ${toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["#", "Course", "Description", "Price", "Discount", "Created At", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course, index) => {
                const id = course._id ?? course.id ?? String(index);
                const finalPrice =
                  course.discountEnabled && course.discount != null
                    ? course.price - (course.price * course.discount) / 100
                    : null;

                return (
                  <tr key={id} className="hover:bg-gray-50 transition-colors">
                    {/* # */}
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>

                    {/* Course */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {course.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={course.image}
                            alt={course.courseName}
                            className="h-10 w-10 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-dashed border-gray-300">
                            <ImageIcon />
                          </div>
                        )}
                        <span className="font-medium text-gray-800 leading-tight">
                          {course.courseName}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-500 truncate">{course.description || "—"}</p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {finalPrice != null ? (
                        <span className="flex flex-col gap-0.5">
                          <span className="line-through text-gray-400 text-xs">
                            ${course.price.toFixed(2)}
                          </span>
                          <span className="text-green-600">${finalPrice.toFixed(2)}</span>
                        </span>
                      ) : (
                        `$${course.price.toFixed(2)}`
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3">
                      {course.discountEnabled && course.discount != null ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {course.discount}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {course.createAt
                        ? new Date(course.createAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(course)}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(course)}
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {editTarget && editForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Edit Course</h2>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">

              {/* ── Image section ─────────────────────────────────────────── */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Thumbnail
                </label>

                {/* Large image preview — always shows current imgbb URL */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Course thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                      <ImageIcon />
                      <span className="text-xs">No image</span>
                    </div>
                  )}

                  {/* Overlay change button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    {imageFile ? "✓ " + imageFile.name.slice(0, 20) : "Change image"}
                  </button>
                </div>

                {/* Current image URL display */}
                {editForm.image && !imageFile && (
                  <p className="text-xs text-gray-400 break-all leading-relaxed px-1">
                    <span className="font-semibold text-gray-500">Current URL: </span>
                    {editForm.image}
                  </p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Course Name */}
              <Field label="Course Name">
                <input
                  required
                  value={editForm.courseName}
                  onChange={(e) => setEditForm({ ...editForm, courseName: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. Advanced React"
                />
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={inputCls}
                  placeholder="Short course description..."
                />
              </Field>

              {/* Price */}
              <Field label="Price ($)">
                <input
                  required
                  type="number"
                  min={0}
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className={inputCls}
                />
              </Field>

              {/* Discount */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editForm.discountEnabled}
                    onChange={(e) =>
                      setEditForm({ ...editForm, discountEnabled: e.target.checked })
                    }
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Discount</span>
                </label>

                {editForm.discountEnabled && (
                  <Field label="Discount (%)">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      value={editForm.discount}
                      onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                      className={inputCls}
                      placeholder="e.g. 20"
                    />
                  </Field>
                )}
              </div>

              {editError && (
                <p className="text-sm text-red-500">{editError}</p>
              )}

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || isUploading}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? "Uploading to ImgBB…" : isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ───────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <TrashIcon />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Delete Course</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">
                    &quot;{deleteTarget.courseName}&quot;
                  </span>
                  ? This cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase">{label}</label>
      {children}
    </div>
  );
}
