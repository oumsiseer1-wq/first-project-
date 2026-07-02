import { Section } from './ui/section';
import { Card, CardHeader, CardContent } from './ui/card';
import { BrainIcon, TargetIcon, SparklesIcon, CheckIcon } from './ui/icons';

export function Solution() {
  const steps = [
    {
      icon: <TargetIcon className="w-6 h-6" />,
      title: 'Purchase Decision',
      description: 'You\'re about to make a purchase',
    },
    {
      icon: <BrainIcon className="w-6 h-6" />,
      title: 'Behavior Analysis',
      description: 'AI analyzes your spending patterns',
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: 'AI Reflection',
      description: 'Get personalized insights instantly',
    },
    {
      icon: <CheckIcon className="w-6 h-6" />,
      title: 'Better Decision',
      description: 'Make an intentional choice',
    },
  ];

  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-4">
          A smarter way to spend
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Our behavioral decision process helps you pause, reflect, and make choices aligned with your goals.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-900 dark:text-white">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {step.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {step.description}
                </p>
              </CardContent>
            </Card>

            {/* Arrow connector */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-zinc-300 dark:text-zinc-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
