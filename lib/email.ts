import { Resend } from "resend";

// ১. ইমেইল পাঠানোর প্যারামিটারের ধরন (Type Definition)
interface SendEmailOptions {
  to: string; // প্রাপকের ইমেইল ঠিকানা
  subject: string; // ইমেইলের বিষয়
  html: string; // ইমেইলের মূল বডি (HTML ফরম্যাট)
}

/**
 * ২. নিরাপদ ইমেইল সেন্ডার ফাংশন
 * এটি ডাইনামিকভাবে প্রতিবার API Key চেক করে Resend এর মাধ্যমে ইমেইল পাঠায়।
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  // রানটাইমে প্রতিবার এনভায়রনমেন্ট ভেরিয়েবল থেকে API Key নেওয়া হচ্ছে
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ [Resend Warning]: .env ফাইলে RESEND_API_KEY পাওয়া যায়নি।");
    return { success: false, error: "Missing RESEND_API_KEY in .env" };
  }

  try {
    const resend = new Resend(apiKey);

    // Resend SDK দিয়ে ইমেইল পাঠানো হচ্ছে
    const response = await resend.emails.send({
      from: "KnowledgeIT <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error("❌ [Resend API Error]:", response.error);
      return { success: false, error: response.error };
    }

    console.log("✅ [Resend Success]: ইমেইল সফলভাবে পাঠানো হয়েছে, ID:", response.data?.id);
    return { success: true, data: response.data };
  } catch (err) {
    console.error("❌ [Resend Exception]:", err);
    return { success: false, error: err };
  }
}
