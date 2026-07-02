import Link from 'next/link';
import { Section } from './ui/section';
import { Button } from './ui/button';
import { ArrowRightIcon } from './ui/icons';

export function FinalCTA() {
  return (
    <Section>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 dark:text-white mb-6">
          Start building better financial habits today
        </h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          Join thousands of people who have transformed their relationship with money through intentional spending.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="group">
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            Schedule a Demo
          </Button>
        </div>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
          No credit card required • Free 14-day trial
        </p>
      </div>
    </Section>
  );
}
