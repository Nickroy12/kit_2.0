"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// ১. আমাদের কনফিগার করা authClient এবং signIn ইমপোর্ট করছি
import { authClient, signIn } from "@/lib/auth-client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ২. ইউআরএল থেকে ইমেইল কুয়েরি প্যারামিটার পড়া হচ্ছে
  const emailParam = searchParams.get("email") || "";
  const [email] = useState(emailParam);

  // ৩. ওটিপি, এরর এবং লোডিং স্টেটসমূহ
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ৪. রি-সেন্ড ওটিপির জন্য ৬০ সেকেন্ডের কুলডাউন টাইমার স্টেট
  const [timer, setTimer] = useState(60);

  // ৬০ সেকেন্ডের কাউন্টডাউন হ্যান্ডলার
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // ৫. ওটিপি সাবমিট করে ভেরিফাই করার হ্যান্ডলার
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // ওটিপি ৬ ডিজিট কি না তা চেক করা হচ্ছে
    if (otp.trim().length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);

    try {
      // Better Auth এর verifyEmail মেথড দিয়ে ওটিপি যাচাই করা হচ্ছে
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: otp.trim(),
      });

      if (error) {
        setErrorMessage(error.message || "Invalid or expired OTP code.");
        setLoading(false);
        return;
      }

      // ভেরিফিকেশন সফল! এখন auto sign-in করা হচ্ছে
      // sessionStorage থেকে signup-এ সংরক্ষিত credentials নেওয়া হচ্ছে
      const savedEmail = sessionStorage.getItem("pending_verify_email") || email;
      const savedPassword = sessionStorage.getItem("pending_verify_password") || "";



      if (savedPassword) {
        // auto sign-in করা হচ্ছে যাতে navbar-এ session দেখায়
        const { error: signInError } = await signIn.email({
          email: savedEmail,
          password: savedPassword,
        });

        console.log("[Verify] signIn error:", signInError);

        // credentials মুছে দেওয়া হচ্ছে — আর দরকার নেই
        sessionStorage.removeItem("pending_verify_email");
        sessionStorage.removeItem("pending_verify_password");

        if (signInError) {
          // sign-in ব্যর্থ হলে ম্যানুয়ালি login করতে পাঠানো হবে
          setSuccessMessage("Email verified! Please sign in to continue.");
          setTimeout(() => {
            router.push(`/auth/signin?email=${encodeURIComponent(savedEmail)}`);
          }, 1200);
          return;
        }
      } else {
        // sessionStorage-এ password নেই (হয়তো page refresh হয়েছে)
        // sign-in page-এ পাঠানো হবে
        console.log("[Verify] No saved password found, redirecting to sign-in");
        setSuccessMessage("Email verified! Please sign in to continue.");
        setTimeout(() => {
          router.push(`/auth/signin`);
        }, 1200);
        return;
      }

      setSuccessMessage("Email verified successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // ৬. ওটিপি পুনরায় পাঠানোর (Resend OTP) হ্যান্ডলার
  const handleResendOtp = async () => {
    if (timer > 0 || resending) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setResending(true);

    try {
      // Better Auth দিয়ে নতুন ওটিপি পাঠানোর রিকোয়েস্ট
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        setErrorMessage(error.message || "Failed to resend verification OTP.");
        setResending(false);
        return;
      }

      setSuccessMessage("A new verification code has been sent to your email!");
      setTimer(60); // পুনরায় ৬০ সেকেন্ডের টাইমার চালু করা হলো
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend OTP.";
      setErrorMessage(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body p-6 sm:p-8">
        {/* হেডার */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-base-content">
            Verify your email
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-primary truncate mt-0.5">
            {email || "your email address"}
          </p>
        </div>

        {/* এরর এলার্ট */}
        {errorMessage && (
          <div
            role="alert"
            className="alert alert-error text-sm py-2.5 px-3.5 mb-4 shadow-sm flex items-start gap-2"
          >
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* সাকসেস এলার্ট */}
        {successMessage && (
          <div
            role="alert"
            className="alert alert-success text-sm py-2.5 px-3.5 mb-4 shadow-sm flex items-start gap-2 text-success-content"
          >
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* ওটিপি ইনপুট ফর্ম */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="form-control">
            <label className="label pb-1.5" htmlFor="otp-input">
              <span className="label-text font-medium text-base-content">
                Enter 6-Digit Code
              </span>
            </label>
            <input
              id="otp-input"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              disabled={loading}
              className="input input-bordered w-full text-center text-2xl tracking-[0.4em] font-mono focus:input-primary transition-all"
              autoFocus
            />
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary w-full shadow-md font-semibold mt-2"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                <span>Verifying...</span>
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* ওটিপি পুনরায় পাঠানোর (Resend) সেকশন */}
        <div className="text-center mt-6 pt-4 border-t border-base-200">
          <p className="text-xs text-base-content/70">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0 || resending}
              className={`font-semibold transition-all ${timer > 0 || resending
                  ? "text-base-content/40 cursor-not-allowed"
                  : "text-primary hover:underline cursor-pointer"
                }`}
            >
              {resending
                ? "Sending..."
                : timer > 0
                  ? `Resend in ${timer}s`
                  : "Resend OTP"}
            </button>
          </p>
        </div>

        {/* ব্যাক টু সাইন ইন লিঙ্ক */}
        <p className="text-center text-xs text-base-content/60 mt-4">
          <Link href="/auth/signin" className="hover:underline">
            Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="card bg-base-100 shadow-xl border border-base-200 p-8 text-center">
              <span className="loading loading-spinner loading-md text-primary mx-auto"></span>
              <p className="text-sm text-base-content/60 mt-2">Loading...</p>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
