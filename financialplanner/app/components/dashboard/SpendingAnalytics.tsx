import { Card, CardHeader, CardContent } from '../ui/card';
import { getSpendingPatterns, getTransactions } from '../../../lib/data';
import { EmptyState } from '../EmptyState';

export function SpendingAnalytics() {
  const patterns = getSpendingPatterns();
  const transactions = getTransactions();
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
  const impulseSpending = transactions.filter(t => t.isImpulse).reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Spending Analytics
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Spending
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
              ${totalSpending.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Impulse Spending
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600 dark:text-red-400">
              ${impulseSpending.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {((impulseSpending / totalSpending) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Transactions
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {transactions.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Avg. Transaction
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
              ${(totalSpending / transactions.length).toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {patterns.length > 0 ? (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              Spending by Category
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div key={pattern.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {pattern.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-900 dark:text-white font-medium">
                        ${pattern.amount}
                      </span>
                      <span className={`text-xs ${
                        pattern.trend === 'up' ? 'text-red-600 dark:text-red-400' :
                        pattern.trend === 'down' ? 'text-green-600 dark:text-green-400' :
                        'text-zinc-500'
                      }`}>
                        {pattern.trend === 'up' ? '↑' : pattern.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-white transition-all duration-500"
                      style={{ width: `${pattern.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title="No spending patterns available"
          description="Upload a new statement to generate category-level insights and personalized spending views."
        />
      )}
    </div>
  );
}
