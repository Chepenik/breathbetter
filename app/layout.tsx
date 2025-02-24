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
  title: "Breath Better",
  description: "A calming breathwork application",
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
