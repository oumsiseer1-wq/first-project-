interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">
          or continue with
        </span>
      </div>
    </div>
  );
}
