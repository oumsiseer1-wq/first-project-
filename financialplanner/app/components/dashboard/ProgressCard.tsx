import { Card, CardHeader, CardContent } from '../ui/card';

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  deadline: string;
  status: 'on-track' | 'behind' | 'ahead';
}

export function ProgressCard({ title, current, target, deadline, status }: ProgressCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = target - current;

  const statusColors = {
    'on-track': 'bg-green-500',
    'behind': 'bg-red-500',
    'ahead': 'bg-blue-500',
  };

  const statusLabels = {
    'on-track': 'On Track',
    'behind': 'Behind',
    'ahead': 'Ahead',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">{title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              ${current.toLocaleString()} of ${target.toLocaleString()}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'on-track' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            status === 'behind' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {statusLabels[status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${statusColors[status]} transition-all duration-500`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
            <span>${remaining.toLocaleString()} remaining</span>
            <span>Due {deadline}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
