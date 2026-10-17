import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
// ১. Better Auth এর অফিসিয়াল emailOTP সার্ভার প্লাগইন ইমপোর্ট করা হচ্ছে
import { emailOTP } from "better-auth/plugins";
// ২. আমাদের তৈরি করা ইমেইল সেন্ডার হেল্পার ফাংশন ইমপোর্ট করছি
import { sendEmail } from "./email";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/database";
const client = new MongoClient(uri);
const db = client.db("knowledge_it");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  
    async sendResetPassword({ user, url }) {
     

      await sendEmail({
        to: user.email,
        subject: "Reset your password - Knowledge IT",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #ea580c; text-align: center;">Knowledge IT Institute</h2>
            <p>Hi <strong>${user.name || user.email}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}"
                style="background-color: #ea580c; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
            <p style="color: #64748b; font-size: 12px;">Or copy this link: <a href="${url}">${url}</a></p>
          </div>
        `,
      });
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  // ৩. প্লাগইন অপশনে emailOTP কনফিগার করা হলো
  plugins: [
    emailOTP({
      // ওটিপির দৈর্ঘ্য ৬ ডিজিট নির্ধারণ করা হলো
      otpLength: 6,
      // ওটিপির মেয়াদ ৩০০ সেকেন্ড (৫ মিনিট)
      expiresIn: 300,
      // নতুন ইউজার সাইন-আপ করলেই সাথে সাথে ওটিপি ইমেইল পাঠানো হবে
      sendVerificationOnSignUp: true,
      // ওটিপি পাঠানোর মূল হ্যান্ডলার ফাংশন
      async sendVerificationOTP({ email, otp, type }) {
   

        // ইমেইল ভেরিফিকেশনের জন্য Resend দিয়ে ইমেইল পাঠানো
        if (type === "email-verification") {
          await sendEmail({
            to: email,
            subject: "Verify your email - Knowledge IT",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #ea580c; text-align: center;">Knowledge IT Institute</h2>
                <p>Welcome! Thank you for signing up. Please verify your email address using the OTP code below:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; background-color: #f1f5f9; padding: 12px 24px; border-radius: 8px; color: #0f172a; display: inline-block;">
                    ${otp}
                  </span>
                </div>
                <p style="color: #64748b; font-size: 14px;">This code will expire in 5 minutes. If you did not create this account, please ignore this email.</p>
              </div>
            `,
          });
        }
      },
    }),
  ],
});