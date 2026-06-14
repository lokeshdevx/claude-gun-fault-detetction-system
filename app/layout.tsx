import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Barrel Fault Detection System",
  description: "AI-powered gun barrel inspection using Claude Vision",
  icons: {
    icon: [
      { url: "/image.png" },
      { url: "/image.png", sizes: "32x32", type: "image/png" },
      { url: "/image.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/image.png",
    shortcut: "/image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d1117]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}