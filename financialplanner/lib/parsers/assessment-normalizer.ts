import {
  AssessmentProfile,
  AssessmentNormalizedData,
  MonthlyStats,
  CategoryBreakdown,
  MerchantStats,
} from '../types';

export function normalizeAssessmentData(
  assessment: AssessmentProfile
): AssessmentNormalizedData {
  const fixedTotal = Object.values(assessment.fixedExpenses).reduce(
    (sum, value) => sum + value,
    0
  );

  const variableTotal = Object.values(assessment.variableExpenses).reduce(
    (sum, value) => sum + value,
    0
  );

  const totalSpending = fixedTotal + variableTotal;
  const totalIncome = assessment.incomeProfile.primaryMonthlyIncome + assessment.incomeProfile.secondaryIncomeSources.reduce((sum, item) => sum + item.amount, 0) + assessment.incomeProfile.averageBonuses;
  const netSavings = Math.max(totalIncome - totalSpending, 0);

  const categories: CategoryBreakdown[] = [
    ...Object.entries(assessment.fixedExpenses).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
      transactionCount: 1,
      trend: 'stable' as const,
    })),
    ...Object.entries(assessment.variableExpenses).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
      transactionCount: 1,
      trend: 'stable' as const,
    })),
  ];

  const merchants: MerchantStats[] = categories.slice(0, 10).map((category) => ({
    merchant: category.category,
    amount: category.amount,
    transactionCount: 1,
    category: category.category,
    frequency: category.amount > 500 ? 'high' : 'medium',
  }));

  const monthlyStats: MonthlyStats = {
    totalSpending,
    totalIncome,
    netSavings,
    transactionCount: 0,
    averageTransaction: 0,
    impulseSpending: 0,
    essentialSpending: Object.entries(assessment.fixedExpenses)
      .filter(([key]) => ['utilities', 'rentMortgage', 'insurance'].includes(key))
      .reduce((sum, [, value]) => sum + value, 0),
    discretionarySpending: variableTotal,
  };

  return {
    ...assessment,
    monthlyStats,
    categories,
    merchants,
  };
}
