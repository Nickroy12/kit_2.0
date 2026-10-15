"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// ১. authClient ইমপোর্ট করছি — এতে resetPassword মেথড আছে
import { authClient } from "@/lib/auth-client";

// ২. Suspense দিয়ে wrap করা জরুরি কারণ useSearchParams() ব্যবহার করছি
function ResetPasswordContent() {
  const router = useRouter();
  // ৩. ইমেইলের লিংক থেকে token কুয়েরি প্যারামিটার পড়া হচ্ছে
  // উদাহরণ URL: /auth/reset-password?token=abc123xyz
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // token না থাকলে invalid link message দেখাব
  const isTokenMissing = !token;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // ৪. Better Auth এর resetPassword মেথড ডাকা হচ্ছে
      // newPassword: ইউজারের নতুন পাসওয়ার্ড
      // token: ইমেইলের লিংক থেকে পাওয়া secure token (Better Auth নিজেই এটা যাচাই করে)
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to reset password. The link may have expired.");
        return;
      }

      // ৫. সফল হলে success দেখাব এবং sign-in এ redirect করব
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Token নেই — ইউজার সরাসরি এই পেজে এসেছে বা লিংক ভুল
  if (isTokenMissing) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl border border-base-200 rounded-2xl">
            <div className="card-body p-8 sm:p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-error/15 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-base-content">Invalid Reset Link</h1>
              <p className="text-sm text-base-content/60">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link href="/auth/forgot-password" className="btn btn-primary w-full font-semibold text-white">
                Request New Link
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl border border-base-200 rounded-2xl">
          <div className="card-body p-8 sm:p-10">

            {/* আইকন ও হেডার */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-base-content">Set New Password</h1>
              <p className="text-sm text-base-content/60 mt-1">
                {success ? "Password updated!" : "Create a strong new password for your account"}
              </p>
            </div>

            {/* সফল হলে এই বার্তা দেখাবে */}
            {success ? (
              <div className="space-y-5 text-center">
                <div className="alert alert-success shadow-sm rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Password reset successful!</p>
                    <p className="text-xs opacity-80">Redirecting you to sign in...</p>
                  </div>
                </div>
                <span className="loading loading-dots loading-md text-primary" />
              </div>
            ) : (
              // নতুন পাসওয়ার্ড ফর্ম
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Error বার্তা */}
                {errorMessage && (
                  <div role="alert" className="alert alert-error text-sm py-2.5 px-3.5 shadow-sm flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="flex-1">{errorMessage}</span>
                  </div>
                )}

                {/* নতুন পাসওয়ার্ড ইনপুট */}
                <div className="form-control">
                  <label className="label pb-1.5" htmlFor="new-password">
                    <span className="label-text font-medium text-base-content">New Password</span>
                    <span className="label-text-alt text-base-content/50">Min. 8 characters</span>
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="input input-bordered w-full pr-11 focus:input-primary transition-colors"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
                      autoComplete="new-password"
                      minLength={8}
                    />
                    {/* পাসওয়ার্ড দেখানো/লুকানোর বাটন */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* পাসওয়ার্ড নিশ্চিত করার ইনপুট */}
                <div className="form-control">
                  <label className="label pb-1.5" htmlFor="confirm-password">
                    <span className="label-text font-medium text-base-content">Confirm Password</span>
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className={`input input-bordered w-full focus:input-primary transition-colors ${
                      confirmPassword && confirmPassword !== newPassword ? "input-error" : ""
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                  {/* রিয়েল-টাইম mismatch warning */}
                  {confirmPassword && confirmPassword !== newPassword && (
                    <label className="label pt-1">
                      <span className="label-text-alt text-error">Passwords do not match</span>
                    </label>
                  )}
                </div>

                {/* Submit বাটন */}
                <button
                  id="reset-password-btn"
                  type="submit"
                  className="btn btn-primary w-full font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <p className="text-center text-sm text-base-content/60 pt-1">
                  Remember your password?{" "}
                  <Link href="/auth/signin" className="text-primary font-medium hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

// ৬. Suspense wrap — useSearchParams() এর জন্য Next.js এ বাধ্যতামূলক
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
