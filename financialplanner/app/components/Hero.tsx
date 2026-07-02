import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRightIcon, ShieldIcon } from './ui/icons';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
              <ShieldIcon className="w-4 h-4" />
              <span>Bank-level security for your data</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Stop impulse spending{' '}
              <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                before it happens
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
              Make intentional purchases with AI-powered financial coaching. Understand your spending habits and build better financial decisions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"
                    />
                  ))}
                </div>
                <span>2,000+ users</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="hidden sm:block">4.9/5 rating</div>
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-700">
              {/* Mockup content */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-600 rounded" />
                    <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                  <div className="h-8 w-8 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-800 rounded-xl p-4 space-y-2">
                      <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      <div className="h-6 w-20 bg-zinc-300 dark:bg-zinc-600 rounded" />
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 space-y-4">
                  <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
                        <div className="flex-1 h-3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                        <div className="h-3 w-12 bg-zinc-300 dark:bg-zinc-600 rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI insight card */}
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-700 dark:to-zinc-600 rounded-xl p-4 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full" />
                    <div className="h-3 w-32 bg-white/30 rounded" />
                  </div>
                  <div className="h-3 w-full bg-white/20 rounded" />
                  <div className="h-3 w-3/4 bg-white/20 rounded" />
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 rounded-2xl blur-2xl opacity-30 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
