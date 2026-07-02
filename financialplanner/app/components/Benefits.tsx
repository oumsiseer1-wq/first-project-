import { Section } from './ui/section';
import { CheckIcon } from './ui/icons';

export function Benefits() {
  const benefits = [
    'Reduce impulse purchases by understanding your triggers',
    'Build healthier financial habits with AI coaching',
    'Understand why you spend the way you do',
    'Save more without strict budgeting rules',
    'Make confident financial decisions',
    'Achieve your financial goals faster',
  ];

  return (
    <Section className="bg-zinc-50 dark:bg-zinc-950">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-6">
            Focus on outcomes, not restrictions
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Unlike traditional budgeting apps that restrict you with rules and limits, we help you understand your behavior and make better choices naturally.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon className="w-4 h-4 text-white dark:text-zinc-900" />
                </div>
                <span className="text-zinc-700 dark:text-zinc-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Monthly Savings</span>
                <span className="text-2xl font-semibold text-zinc-900 dark:text-white">$342</span>
              </div>
              <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-zinc-900 dark:bg-white rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-4">
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-white">23%</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Less impulse spending</div>
                </div>
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-4">
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-white">89%</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Better decisions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
