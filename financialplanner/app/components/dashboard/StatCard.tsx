import { Card, CardHeader, CardContent } from '../ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, changeLabel, icon, trend = 'neutral' }: StatCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-zinc-600 dark:text-zinc-400',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {title}
        </div>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
          {value}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className={trendColors[trend]}>
              {trendIcons[trend]} {Math.abs(change)}%
            </span>
            {changeLabel && (
              <span className="text-zinc-500 dark:text-zinc-500">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
