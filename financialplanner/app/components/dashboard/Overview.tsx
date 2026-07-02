import { StatCard } from './StatCard';
import { getStats } from '../../../lib/data';
import { WalletIcon, PiggyBankIcon, TrendDownIcon } from '../ui/icons';

export function Overview() {
  const stats = getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
          Welcome back
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Here's your financial overview for this month
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Spending"
          value={`$${stats.monthlySpending.toLocaleString()}`}
          change={stats.trendPercentage}
          changeLabel="vs last month"
          trend={stats.spendingTrend}
          icon={<WalletIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Budget"
          value={`$${stats.monthlyBudget.toLocaleString()}`}
          icon={<WalletIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Remaining Budget"
          value={`$${stats.remainingBudget.toLocaleString()}`}
          icon={<TrendDownIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Savings"
          value={`$${stats.monthlySavings.toLocaleString()}`}
          icon={<PiggyBankIcon className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}
