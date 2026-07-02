import { Section } from './ui/section';
import { Card, CardHeader, CardContent } from './ui/card';
import { TrendDownIcon } from './ui/icons';

export function Problem() {
  const problems = [
    {
      title: 'They only analyze past spending',
      description: 'Traditional apps show you what you already spent, but never help you make better decisions in the moment.',
    },
    {
      title: "They don't help at decision time",
      description: "By the time you see your spending data, the money is already gone. You need guidance before you buy.",
    },
    {
      title: "They don't change behavior",
      description: "Tracking expenses alone doesn't build new habits. You need active coaching and behavioral insights.",
    },
  ];

  return (
    <Section className="bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-4">
          Why traditional budgeting apps fail
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Most financial tools are designed for accountants, not real people trying to build better habits.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((problem, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <TrendDownIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {problem.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {problem.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
