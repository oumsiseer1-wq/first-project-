import { Card, CardHeader, CardContent } from '../ui/card';
import { getTransactions, getSpendingPatterns } from '../../../lib/data';
import { ClockIcon, SparklesIcon, TargetIcon, CheckIcon } from '../ui/icons';
import { EmptyState } from '../EmptyState';

export function RecentActivity() {
  const transactions = getTransactions().slice(0, 5);
  const patterns = getSpendingPatterns();

  // Generate activities from actual data instead of hardcoded values
  const activities = [];

  // Add recent transaction activity
  if (transactions.length > 0) {
    const latestTx = transactions[0];
    activities.push({
      type: 'purchase',
      icon: <CheckIcon className="w-4 h-4" />,
      title: 'New purchase',
      description: `${latestTx.description} - $${latestTx.amount.toFixed(2)}`,
      time: new Date(latestTx.date).toLocaleDateString(),
    });
  }

  // Add spending pattern insight if available
  if (patterns.length > 0) {
    const topCategory = patterns.reduce((max, p) => p.amount > max.amount ? p : max);
    activities.push({
      type: 'insight',
      icon: <SparklesIcon className="w-4 h-4" />,
      title: 'Top spending category',
      description: `${topCategory.category} - $${topCategory.amount.toLocaleString()}`,
      time: 'Current month',
    });
  }

  // Add goal progress activity if goals exist
  const profileData = require('../../../lib/data').getProfile?.();
  if (profileData?.goals && profileData.goals.length > 0) {
    const goal = profileData.goals[0];
    const progress = goal.current ? (goal.current / goal.target) * 100 : 0;
    activities.push({
      type: 'goal',
      icon: <TargetIcon className="w-4 h-4" />,
      title: 'Goal progress',
      description: `${goal.name} - ${Math.round(progress)}% complete`,
      time: '1 week ago',
    });
  }

  // Add budget alert activity if spending is high
  if (patterns.length > 0) {
    const totalSpending = patterns.reduce((sum, p) => sum + p.amount, 0);
    const budgetLimit = require('../../../lib/data').getStats?.()?.monthlyBudget || 0;
    if (budgetLimit > 0) {
      const percentUsed = (totalSpending / budgetLimit) * 100;
      if (percentUsed > 70) {
        activities.push({
          type: 'budget',
          icon: <ClockIcon className="w-4 h-4" />,
          title: 'Budget alert',
          description: `Spending at ${Math.round(percentUsed)}% of monthly budget`,
          time: 'Today',
        });
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Recent Activity
      </h2>

      {transactions.length > 0 || activities.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-500 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4">
                  <p className="text-sm text-zinc-500">No activity yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title="No activity yet"
          description="Insights and activity updates will appear after your first upload."
        />
      )}
    </div>
  );
}
