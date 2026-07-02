'use client';

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Array<{ label: string; description: string }>;
}

export function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Your setup path</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">A few quick steps to unlock your dashboard</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <div key={step.label} className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isComplete
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : isActive
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                      : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {step.label}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
