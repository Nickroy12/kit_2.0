'use client';

import React, { useState, useRef } from 'react';
import { Camera, Check, Sparkles, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '@/lib/core/imgbb';
import { addCourse } from '@/lib/action';
import { slugify } from '@/lib/utils';

interface CourseFormData {
  courseName: string;
  description: string;
  image: File | null;
  price: string;
  discountEnabled: boolean;
  discount: string;
}

const initialFormData: CourseFormData = {
  courseName: '',
  description: '',
  image: null,
  price: '',
  discountEnabled: false,
  discount: '',
};

const NewCourse: React.FC = () => {
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      toast.error('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be under 5 MB.');
      toast.error('Image size must be under 5 MB.');
      return;
    }

    setError('');
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDiscountToggle = () => {
    setFormData((prev) => ({
      ...prev,
      discountEnabled: !prev.discountEnabled,
      discount: '',
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError('');

    const price = Number(formData.price);
    const discount = Number(formData.discount);

    if (!formData.image) {
      setError('Please select a course image.');
      toast.error('Please upload a course image.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid course price.');
      toast.error('Enter a valid course price.');
      return;
    }

    if (
      formData.discountEnabled &&
      (!Number.isFinite(discount) || discount < 0 || discount > 100)
    ) {
      setError('Discount must be between 0 and 100%.');
      toast.error('Discount must be between 0 and 100%.');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload image to ImgBB
      const imageUrl = await uploadImage(formData.image);

      // Step 2: Prepare course data
      const courseData = {
        courseName: formData.courseName.trim(),
        slug: slugify(formData.courseName.trim()),
        description: formData.description.trim(),
        image: imageUrl,
        price,
        discount: formData.discountEnabled ? discount : null,
      };
      const data = await addCourse(courseData);
      console.log('New course:', data);
      toast.success('Course created & image uploaded successfully!');

      // Reset form fields
      setFormData(initialFormData);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Something went wrong.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFF5EB] via-[#FFE4CC]/60 to-[#FF8A00] py-10 px-4 sm:px-6 lg:px-8">
      {/* Ambient background 3D-styled spheres to match the reference UI */}
      <div className="pointer-events-none absolute -top-12 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 opacity-80 blur-[2px] shadow-2xl" />
      <div className="pointer-events-none absolute top-1/4 -left-12 h-36 w-36 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-70 blur-[1px] shadow-lg" />
      <div className="pointer-events-none absolute top-1/3 -right-12 h-44 w-44 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 opacity-75 blur-[1px] shadow-xl" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 opacity-60 blur-[1px] shadow-lg" />
      <div className="pointer-events-none absolute -bottom-6 right-16 h-28 w-28 rounded-full bg-gradient-to-br from-orange-300 to-amber-400 opacity-60 blur-[1px] shadow-md" />

      {/* Main Form Card */}
      <div className="relative z-10 mx-auto max-w-7xl rounded-[32px] border border-white/80 bg-white p-7 shadow-2xl shadow-orange-950/10 sm:p-10">
        {/* Top Header Helper */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 font-medium text-orange-600">
            <Sparkles className="h-3.5 w-3.5" /> Course Management
          </span>
          <span>
            Already saved?{' '}
            <span className="cursor-pointer font-semibold text-orange-500 hover:underline">
              View Courses
            </span>
          </span>
        </div>

        {/* Title */}
        <div className="mt-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create Course
          </h1>
        </div>

        {/* Multi-step progress indicator */}


        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Details */}
          <div>
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Basic Details
              </h2>
            </div>

            {/* Course Name & Add Photo in a clean row layout */}
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Course Name input */}
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-700">
                  Full Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  placeholder="Enter Course Name"
                  required
                  className="w-full rounded-2xl border border-transparent bg-[#F4F7FB] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100/60"
                />
              </div>

              {/* Add Photo circular button from reference UI */}
              <div className="flex flex-col items-center sm:items-end">
                <label className="group relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <Camera className="h-7 w-7 text-white" />
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-600">
                    {formData.image ? 'Change Photo' : 'Add Photo'}
                  </span>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      title="Remove image"
                      className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description (Vision & Mission style textarea) */}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-700">
                Course Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Type course overview and learning objectives here..."
                rows={4}
                required
                className="w-full resize-none rounded-2xl border border-transparent bg-[#F4F7FB] px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100/60"
              />
            </div>
          </div>

          {/* Section: Pricing (Education card style in reference UI) */}
          <div className="pt-1">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                Pricing & Discounts
              </h2>
            </div>

            {/* Nested container card matching the reference Education block */}
            <div className="rounded-2xl border border-gray-100 bg-[#F4F7FB]/70 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Price input */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-700">
                    Course Price (৳)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter Price e.g. 5000"
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded-2xl border border-transparent bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100/60"
                  />
                </div>

                {/* Discount Toggle Switch */}
                <div className="flex flex-col justify-center">
                  <span className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-700">
                    Offer Discount
                  </span>
                  <div className="flex h-[46px] items-center justify-between rounded-2xl border border-transparent bg-white px-4 shadow-sm">
                    <span className="text-xs font-medium text-gray-600">
                      {formData.discountEnabled ? 'Discount Active' : 'No Discount'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData.discountEnabled}
                      onClick={handleDiscountToggle}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${formData.discountEnabled ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all ${formData.discountEnabled ? 'left-5' : 'left-0.5'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Conditional Discount Percentage input & live calculation */}
              {formData.discountEnabled && (
                <div className="mt-4 border-t border-gray-200/60 pt-4">
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-700">
                        Discount Rate (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="e.g. 20"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                        className="w-full rounded-2xl border border-transparent bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100/60"
                      />
                    </div>

                    {formData.price !== '' &&
                      formData.discount !== '' &&
                      Number(formData.discount) >= 0 &&
                      Number(formData.discount) <= 100 && (
                        <div className="flex items-center gap-2 rounded-2xl bg-orange-100/70 px-4 py-3 text-orange-900">
                          <Tag className="h-4 w-4 shrink-0 text-orange-600" />
                          <div className="text-xs">
                            <span className="font-medium text-gray-600">Final Price: </span>
                            <span className="font-bold text-orange-700">
                              ৳
                              {(
                                Number(formData.price) *
                                (1 - Number(formData.discount) / 100)
                              ).toFixed(2)}
                            </span>
                            <span className="ml-1 text-[11px] text-gray-500 line-through">
                              ৳{Number(formData.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Centered Save & Continue pill button from the reference UI */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading & Saving...
                </>
              ) : (
                <>
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCourse;

