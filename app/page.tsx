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
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
              style={{ lineHeight: '1.2' }}
          >
            Transform Your Life Through Breath
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-white/80 mb-8 sm:mb-12 leading-relaxed">
            Discover the power of conscious breathing to reduce stress, increase energy,
            and enhance your overall well-being.
          </p>

          <Link 
            href="/practice"
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-white 
                     bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg
                     hover:from-pink-600 hover:to-violet-600 transform hover:-translate-y-1
                     transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Breathing →
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
          <div className="text-center p-4 sm:p-6">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🧘</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-800 dark:text-white">Reduce Stress</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/70">
              Activate your body&apos;s natural relaxation response through conscious breathing
            </p>
          </div>

          <div className="text-center p-4 sm:p-6">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-800 dark:text-white">Boost Energy</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/70">
              Increase oxygen flow and vitality through proven breathing techniques
            </p>
          </div>

          <div className="text-center p-4 sm:p-6 sm:col-span-2 md:col-span-1 mx-auto sm:max-w-md md:max-w-none">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-800 dark:text-white">Improve Focus</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/70">
              Enhance mental clarity and concentration through mindful breathing practices
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 sm:py-8 text-center text-slate-700 dark:text-white/50 mt-8">
        <p>Breathe better. Feel better. Live better.</p>
      </footer>

      <SocialLinks />
      <SupportButton />
    </div>
  );
}
