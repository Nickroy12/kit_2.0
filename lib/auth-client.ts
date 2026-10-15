import { createAuthClient } from "better-auth/react";
// ১. Better Auth এর অফিসিয়াল ক্লায়েন্ট OTP প্লাগইন ইমপোর্ট করা হচ্ছে
import { emailOTPClient } from "better-auth/client/plugins";

// ২. ক্লায়েন্ট ইনিশিয়ালাইজ করার সময় plugins অ্যারেতে প্লাগইনটি যুক্ত করা হলো
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [emailOTPClient()],
});

// ৩. আমাদের প্রয়োজনীয় অথেন্টিকেশন মেথডগুলো এক্সপোর্ট করা হচ্ছে
export const { signIn, signUp, signOut, useSession } = authClient;
