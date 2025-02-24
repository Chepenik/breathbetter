import Link from "next/link";
import { SupportButton } from "@/components/SupportButton";
import { SocialLinks } from "@/components/SocialLinks";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
              style={{ lineHeight: '1.2' }}
          >
            Transform Your Life Through Breath
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 dark:text-white/80 mb-12 leading-relaxed">
            Discover the power of conscious breathing to reduce stress, increase energy,
            and enhance your overall well-being.
          </p>

          <Link 
            href="/practice"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white 
                     bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg
                     hover:from-pink-600 hover:to-violet-600 transform hover:-translate-y-1
                     transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Breathing →
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🧘</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Reduce Stress</h3>
            <p className="text-slate-700 dark:text-white/70">
              Activate your body&apos;s natural relaxation response through conscious breathing
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Boost Energy</h3>
            <p className="text-slate-700 dark:text-white/70">
              Increase oxygen flow and vitality through proven breathing techniques
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">Improve Focus</h3>
            <p className="text-slate-700 dark:text-white/70">
              Enhance mental clarity and concentration through mindful breathing practices
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 dark:text-white/50">
        <p>Breathe better. Feel better. Live better.</p>
      </footer>

      <SocialLinks />
      <SupportButton />
    </div>
  );
}
