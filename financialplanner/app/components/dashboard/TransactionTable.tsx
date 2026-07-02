'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isImpulse?: boolean;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [filter, setFilter] = useState<'all' | 'impulse' | 'essential'>('all');
  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'impulse' && t.isImpulse) ||
      (filter === 'essential' && !t.isImpulse);
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            Recent Transactions
          </h3>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="impulse">Impulse</option>
              <option value="essential">Essential</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      <span className="text-sm text-zinc-900 dark:text-white">
                        {transaction.description}
                      </span>
                      {transaction.isImpulse && (
                        <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                          Impulse
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {transaction.category}
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-zinc-900 dark:text-white">
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
