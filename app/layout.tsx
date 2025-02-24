import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Breath Better - Mindful Breathing Exercises",
  description: "Transform your life through guided breathing exercises. Reduce stress, boost energy, and improve focus with our interactive breathing patterns.",
  keywords: "breathing exercises, meditation, mindfulness, stress reduction, box breathing, wim hof",
  openGraph: {
    title: "Breath Better - Mindful Breathing Exercises",
    description: "Transform your life through guided breathing exercises",
    url: "https://breathbetter.xyz", // Update with your actual domain
    siteName: "Breath Better",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Breath Better - Mindful Breathing Exercises",
    description: "Transform your life through guided breathing exercises",
    creator: "@conorchepenik",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
                   bg-gradient-to-b from-slate-100 to-white dark:from-gray-900 dark:to-black
                   text-slate-900 dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <Navigation />
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
