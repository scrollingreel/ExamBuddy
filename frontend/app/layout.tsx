import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ExamBuddy - Collaborative Study Platform",
    template: "%s | ExamBuddy",
  },
  description: "The best platform for B.Tech students to share notes, track study progress, and access university papers. Designed for AKTU and other technical universities.",
  keywords: ["AKTU Notes", "BTech Notes", "ExamBuddy", "Study Material", "Previous Year Papers", "Engineering Notes", "Collaborative Study"],
  authors: [{ name: "ExamBuddy Team" }],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://exambuddy-ymor.onrender.com", // Or your Vercel URL
    title: "ExamBuddy - Collaborative Study Platform",
    description: "Share notes, track progress, and ace your exams with ExamBuddy.",
    siteName: "ExamBuddy",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExamBuddy - Ace Your Exams",
    description: "Access premium notes, sessional papers, and track your study hours.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
