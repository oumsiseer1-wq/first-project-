'use client';

import { useState, useEffect } from 'react';
import { InsightCard } from './InsightCard';
import { analyzeSpendingBehavior } from '../../../lib/ai';
import { getTransactions, getSpendingPatterns, getGoals } from '../../../lib/data';
import { BrainIcon, CheckIcon, AlertTriangleIcon } from '../ui/icons';
import { EmptyState } from '../EmptyState';

export function AIAnalysis() {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    async function loadAnalysis() {
      const transactions = getTransactions();
      const patterns = getSpendingPatterns();
      const goals = getGoals();

      if (!transactions.length) {
        setAnalysis(null);
        setLoading(false);
        return;
      }

      const result = await analyzeSpendingBehavior({
        transactions,
        spendingPatterns: patterns,
        userGoals: goals,
      });

      setAnalysis(result);
      setLoading(false);
    }

    loadAnalysis();
  }, []);

  if (!loading && !analysis) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">AI Behavioral Analysis</h2>
        <EmptyState
          title="No AI analysis yet"
          description="Upload a statement to generate behavioral insights and personalized recommendations."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          AI Behavioral Analysis
        </h2>
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  const riskColor = analysis.riskScore < 30 ? 'text-green-600 dark:text-green-400' :
                    analysis.riskScore < 60 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        AI Behavioral Analysis
      </h2>

      <div className="grid lg:grid-cols-2 gap-4">
        <InsightCard title="Behavioral Summary" icon={<BrainIcon className="w-5 h-5" />}>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {analysis.behavioralSummary}
          </p>
        </InsightCard>

        <InsightCard title="Risk Score">
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${riskColor}`}>
              {analysis.riskScore}
            </div>
            <div className="flex-1">
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    analysis.riskScore < 30 ? 'bg-green-500' :
                    analysis.riskScore < 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${analysis.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                {analysis.riskScore < 30 ? 'Low Risk' :
                 analysis.riskScore < 60 ? 'Moderate Risk' :
                 'High Risk'}
              </p>
            </div>
          </div>
        </InsightCard>

        <InsightCard title="Spending Patterns">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {analysis.spendingPatterns}
          </p>
        </InsightCard>

        <InsightCard title="Impulse Indicators">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {analysis.impulseIndicators}
          </p>
        </InsightCard>

        <InsightCard title="Category Trends">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {analysis.categoryTrends}
          </p>
        </InsightCard>

        <InsightCard title="Weekly Observations">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {analysis.weeklyObservations}
          </p>
        </InsightCard>

        <InsightCard title="Monthly Observations">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {analysis.monthlyObservations}
          </p>
        </InsightCard>

        <InsightCard title="Positive Habits">
          <ul className="space-y-2">
            {analysis.positiveHabits.map((habit: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>{habit}</span>
              </li>
            ))}
          </ul>
        </InsightCard>

        <InsightCard title="Areas for Improvement" icon={<AlertTriangleIcon className="w-5 h-5" />}>
          <ul className="space-y-2">
            {analysis.areasForImprovement.map((area: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </InsightCard>
      </div>

      <InsightCard title="Recommendations">
        <ul className="space-y-2">
          {analysis.recommendations.map((rec: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
              <CheckIcon className="w-4 h-4 text-zinc-600 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </InsightCard>
    </div>
  );
}
