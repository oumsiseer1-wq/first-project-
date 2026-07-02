import { Section } from './ui/section';
import { CheckIcon } from './ui/icons';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Track spending',
      description: 'Connect your accounts or manually log purchases to build your financial profile.',
    },
    {
      number: '02',
      title: 'Learn your habits',
      description: 'Our AI analyzes your patterns to understand your unique spending behaviors.',
    },
    {
      number: '03',
      title: 'Receive AI guidance',
      description: "Get real-time insights and coaching when you're about to make a purchase.",
    },
    {
      number: '04',
      title: 'Build better habits',
      description: 'Over time, develop intentional spending patterns that align with your goals.',
    },
  ];

  return (
    <Section id="how-it-works">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-4">
          How it works
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Four simple steps to transform your relationship with money.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="text-5xl font-bold text-zinc-200 dark:text-zinc-800 mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              {step.description}
            </p>

            {/* Checkmark for completed steps */}
            <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-zinc-900 dark:text-white" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
