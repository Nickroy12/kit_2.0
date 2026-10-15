"use client";

import { useState } from "react";
import Link from "next/link";
// ১. authClient ইমপোর্ট করছি — এতে forgetPassword মেথড আছে
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // ইমেইল পাঠানো সফল হলে এই state true হবে — form লুকিয়ে success message দেখাবে
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // ২. Better Auth এর requestPasswordReset মেথড ডাকা হচ্ছে
      // (forgetPassword নয় — Better Auth 1.7.9-এ এই নামে আছে)
      // email: কোন ইউজারের পাসওয়ার্ড রিসেট করতে হবে
      // redirectTo: টোকেন verify হওয়ার পর কোথায় redirect করবে
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: "/auth/reset-password",
      });

      if (error) {
        setErrorMessage(error.message || "Failed to send reset email. Please try again.");
        return;
      }

      // ৩. সফল হলে form লুকিয়ে success বার্তা দেখাব
      setEmailSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* কার্ড */}
        <div className="card bg-base-100 shadow-xl border border-base-200 rounded-2xl">
          <div className="card-body p-8 sm:p-10">

            {/* আইকন ও হেডার */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-base-content">Forgot Password?</h1>
              <p className="text-sm text-base-content/60 mt-1">
                {emailSent
                  ? "Check your inbox"
                  : "Enter your email and we'll send you a reset link"}
              </p>
            </div>

            {/* ইমেইল পাঠানো সফল হলে এই বার্তা দেখাবে */}
            {emailSent ? (
              <div className="space-y-5 text-center">
                <div className="alert alert-success shadow-sm rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Reset email sent!</p>
                    <p className="text-xs opacity-80">
                      We've sent a password reset link to <strong>{email}</strong>. Check your inbox and spam folder.
                    </p>
                  </div>
                </div>

                <p className="text-sm text-base-content/60">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                    onClick={() => setEmailSent(false)}
                  >
                    Try again
                  </button>
                </p>

                <Link
                  href="/auth/signin"
                  className="btn btn-ghost btn-sm w-full mt-2"
                >
                  ← Back to Sign In
                </Link>
              </div>
            ) : (
              // ইমেইল ইনপুট ফর্ম
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

                {/* Email ইনপুট */}
                <div className="form-control">
                  <label className="label pb-1.5" htmlFor="forgot-email">
                    <span className="label-text font-medium text-base-content">Email Address</span>
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full focus:input-primary transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>

                {/* Submit বাটন */}
                <button
                  id="send-reset-link-btn"
                  type="submit"
                  className="btn btn-primary w-full font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                {/* Sign In লিংক */}
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
