import { Section } from './ui/section';
import { Card, CardHeader, CardContent } from './ui/card';
import { BrainIcon, ChartIcon, ShieldIcon, ClockIcon, HeartIcon, SparklesIcon } from './ui/icons';

export function Features() {
  const features = [
    {
      icon: <BrainIcon className="w-6 h-6" />,
      title: 'Behavior Analysis',
      description: 'Understand your spending patterns with AI-powered insights',
    },
    {
      icon: <HeartIcon className="w-6 h-6" />,
      title: 'Purchase Reflection',
      description: 'Reflect on purchases before and after you make them',
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: 'AI Insights',
      description: 'Get personalized recommendations based on your habits',
    },
    {
      icon: <ChartIcon className="w-6 h-6" />,
      title: 'Weekly Reports',
      description: 'Track your progress with detailed weekly summaries',
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: 'Savings Goals',
      description: 'Set meaningful goals and track your journey',
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: 'Behavior Timeline',
      description: 'Visualize your financial decisions over time',
    },
  ];

  return (
    <Section id="features" className="bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-4">
          Everything you need to build better habits
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Powerful features designed to help you understand and improve your relationship with money.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-900 dark:text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
