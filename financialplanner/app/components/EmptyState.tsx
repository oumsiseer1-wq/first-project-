'use client';

import { Button } from './ui/button';
import { SparklesIcon } from './ui/icons';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
        <SparklesIcon className="h-7 w-7 text-zinc-600 dark:text-zinc-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
      <p className="mx-auto max-w-md text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-6 flex justify-center">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
