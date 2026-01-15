import Link from "next/link";
import { SupportButton } from "@/components/SupportButton";
import { SocialLinks } from "@/components/SocialLinks";
import Script from "next/script";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Structured Data for SEO */}
      <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Breath Better",
        "url": "https://breathbetter.io",
        "description": "Transform your life through guided breathing exercises. Reduce stress, boost energy, and improve focus with our interactive breathing patterns.",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": "Conor Chepenik"
        }
      })}} />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-slate-800 dark:text-white"
              style={{ lineHeight: '1.3' }}
          >
            Find your calm through{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              mindful breathing
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-white/70 mb-10 sm:mb-12 leading-relaxed max-w-xl mx-auto">
            Simple guided exercises to help you relax, focus, and feel more grounded —
            whenever you need a moment of peace.
          </p>

          <Link
            href="/practice"
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-white
                     bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl
                     hover:from-pink-600 hover:to-violet-600
                     transition-all duration-200 shadow-md hover:shadow-lg
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
          >
            Begin practice
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 sm:mt-24 md:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-3xl mx-auto px-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-500/10 flex items-center justify-center">
              <span className="text-2xl">🧘</span>
            </div>
            <h3 className="text-base font-medium mb-2 text-slate-800 dark:text-white">Feel calmer</h3>
            <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed">
              Let go of tension and find a sense of ease
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-base font-medium mb-2 text-slate-800 dark:text-white">Think clearer</h3>
            <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed">
              Quiet mental chatter and sharpen your focus
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-base font-medium mb-2 text-slate-800 dark:text-white">Build a habit</h3>
            <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed">
              A few minutes a day makes a real difference
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 sm:py-10 text-center text-slate-500 dark:text-white/40 mt-8">
        <p className="text-sm">Take a breath. You deserve it.</p>
      </footer>

      <SocialLinks />
      <SupportButton />
    </div>
  );
}
