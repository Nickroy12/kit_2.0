"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, signOut } from "@/lib/auth-client";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string) || "";
    const terms = formData.get("terms");

    if (!name) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!terms) {
      setErrorMessage("You must accept the terms and conditions to sign up.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(error.message || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // verify-email পেজে auto sign-in করার জন্য credentials সাময়িকভাবে সংরক্ষণ
      // ব্রাউজার বন্ধ হলে sessionStorage স্বয়ংক্রিয়ভাবে মুছে যাবে
      sessionStorage.setItem("pending_verify_email", email);
      sessionStorage.setItem("pending_verify_password", password);

      // সাইন-আপ সফল হওয়ার পরপরই session বাতিল করা হচ্ছে
      // কারণ ইমেইল verify না হওয়া পর্যন্ত ইউজারকে লগইন দেখানো উচিত না
      await signOut();

      setSuccessMessage("Account created! A verification code has been sent to your email.");
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-amber-200/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-6 sm:p-8">
            {/* Header */}
            <div className="text-center flex flex-col justify-center items-center mb-6">
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
              <h1 className="text-2xl font-bold tracking-tight text-base-content">
                Create an account
              </h1>
              <p className="text-sm text-base-content/70 mt-1">
                Join KnowledgeIT today to explore resources & ideas
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="alert alert-error text-sm py-2.5 px-3.5 mb-4 shadow-sm flex items-start gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="flex-1">{errorMessage}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div
                role="alert"
                className="alert alert-success text-sm py-2.5 px-3.5 mb-4 shadow-sm flex items-start gap-2 text-success-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="flex-1">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field 1: Name */}
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="name-input">
                  <span className="label-text font-medium text-base-content">Full Name</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-base-content/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    id="name-input"
                    name="name"
                    type="text"
                    required
                    disabled={loading}
                    placeholder="John Doe"
                    className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                  />
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="email-input">
                  <span className="label-text font-medium text-base-content">Email</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-base-content/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span>
                  <input
                    id="email-input"
                    name="email"
                    type="email"
                    required
                    disabled={loading}
                    placeholder="name@example.com"
                    className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                  />
                </div>
              </div>

              {/* Field 3: Password (with Toggle) */}
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="password-input">
                  <span className="label-text font-medium text-base-content">Password</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-base-content/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    id="password-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    disabled={loading}
                    placeholder="Create a strong password (min 8 chars)"
                    className="input input-bordered w-full pl-10 pr-12 focus:input-primary transition-all"
                  />
                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-ghost btn-circle btn-xs absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      /* Eye Off Icon */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <label className="label pt-1">
                  <span className="label-text-alt text-xs text-base-content/60">
                    Must be at least 8 characters
                  </span>
                </label>
              </div>

              {/* Terms agreement */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  disabled={loading}
                  className="checkbox checkbox-primary checkbox-sm mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-xs sm:text-sm text-base-content/80 cursor-pointer select-none leading-relaxed"
                >
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full shadow-md font-semibold mt-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="divider text-xs text-base-content/50 my-6">OR</div>

            {/* Switch to Sign In */}
            <p className="text-center text-sm text-base-content/80">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold text-primary hover:underline transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
