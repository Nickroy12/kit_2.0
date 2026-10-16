import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KnowledgeIT",
  description: "KnowledgeIT Authentication & Resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className={`${poppins.className} min-h-full flex flex-col bg-base-100 text-base-content`}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
