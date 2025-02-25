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
  metadataBase: new URL('https://breathbetter.io'),
  keywords: [
    "breathing exercises", 
    "mindful breathing", 
    "box breathing", 
    "4-7-8 breathing", 
    "wim hof method", 
    "stress reduction", 
    "meditation", 
    "breathwork",
    "anxiety relief",
    "focus improvement"
  ],
  authors: [{ name: "Conor Chepenik" }],
  creator: "Conor Chepenik",
  publisher: "Conor Chepenik",
  openGraph: {
    type: "website",
    url: "https://breathbetter.io",
    title: "Breath Better - Transform Your Life Through Breath",
    description: "Discover the power of conscious breathing to reduce stress, increase energy, and enhance your overall well-being.",
    siteName: "Breath Better",
    images: [{
      url: "https://i.nostr.build/GpyOC3yOQ3YglkRk.jpg",
      width: 1200,
      height: 630,
      alt: "Breath Better - Mindful Breathing App"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Breath Better - Transform Your Life Through Breath",
    description: "Discover the power of conscious breathing to reduce stress, increase energy, and enhance your overall well-being.",
    creator: "@conorchepenik",
    images: ["https://i.nostr.build/GpyOC3yOQ3YglkRk.jpg"],
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
