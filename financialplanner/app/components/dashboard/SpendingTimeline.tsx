import { TransactionTable } from './TransactionTable';
import { getTransactions } from '../../../lib/data';
import { EmptyState } from '../EmptyState';

export function SpendingTimeline() {
  const transactions = getTransactions();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Spending Timeline
      </h2>
      {transactions.length > 0 ? (
        <TransactionTable transactions={transactions} />
      ) : (
        <EmptyState
          title="No transactions yet"
          description="Your transaction history will appear here after you upload a statement."
        />
      )}
    </div>
  );
}
