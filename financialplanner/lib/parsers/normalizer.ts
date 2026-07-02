import { ParsedTransaction, CategoryBreakdown, MerchantStats, MonthlyStats } from '../types';

export interface NormalizedData {
  transactions: ParsedTransaction[];
  categories: CategoryBreakdown[];
  merchants: MerchantStats[];
  monthlyStats: MonthlyStats;
}

export function normalizeTransactions(transactions: ParsedTransaction[]): NormalizedData {
  // Sort by date
  const sorted = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Detect impulse spending
  const withImpulseDetection = detectImpulseSpending(sorted);

  // Calculate categories
  const categories = calculateCategories(withImpulseDetection);

  // Calculate merchant stats
  const merchants = calculateMerchants(withImpulseDetection);

  // Calculate monthly stats
  const monthlyStats = calculateMonthlyStats(withImpulseDetection);

  return {
    transactions: withImpulseDetection,
    categories,
    merchants,
    monthlyStats,
  };
}

function detectImpulseSpending(transactions: ParsedTransaction[]): ParsedTransaction[] {
  const impulseKeywords = [
    'entertainment', 'gaming', 'spotify', 'netflix', 'amazon', 'uber',
    'lyft', 'restaurant', 'cafe', 'coffee', 'bar', 'club', 'movie',
    'concert', 'game', 'app store', 'play store', 'impulse',
  ];

  return transactions.map(t => {
    const lowerDesc = t.description.toLowerCase();
    const lowerMerchant = t.merchant.toLowerCase();
    
    // Mark as impulse if matches keywords
    const isImpulse = impulseKeywords.some(keyword =>
      lowerDesc.includes(keyword) || lowerMerchant.includes(keyword)
    );

    // Also mark as impulse if it's a weekend discretionary purchase
    const date = new Date(t.date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isDiscretionary = !isEssentialCategory(t.category);
    
    if (isWeekend && isDiscretionary && t.amount > 20) {
      return { ...t, isImpulse: true };
    }

    return { ...t, isImpulse: isImpulse || false };
  });
}

function isEssentialCategory(category?: string): boolean {
  const essentialCategories = [
    'groceries', 'utilities', 'rent', 'mortgage', 'insurance',
    'healthcare', 'pharmacy', 'doctor', 'hospital', 'transportation',
    'gas', 'fuel', 'education', 'tuition', 'loan payment',
  ];

  if (!category) return false;
  return essentialCategories.some(cat => category.toLowerCase().includes(cat));
}

function calculateCategories(transactions: ParsedTransaction[]): CategoryBreakdown[] {
  const categoryMap = new Map<string, { amount: number; count: number }>();
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  transactions.forEach(t => {
    const category = t.category || 'Uncategorized';
    const existing = categoryMap.get(category) || { amount: 0, count: 0 };
    categoryMap.set(category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  });

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    amount: data.amount,
    percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    transactionCount: data.count,
    trend: 'stable' as const, // TODO: Calculate trend from historical data
  })).sort((a, b) => b.amount - a.amount);
}

function calculateMerchants(transactions: ParsedTransaction[]): MerchantStats[] {
  const merchantMap = new Map<string, { amount: number; count: number; category: string }>();

  transactions.forEach(t => {
    const existing = merchantMap.get(t.merchant) || { amount: 0, count: 0, category: t.category || 'Uncategorized' };
    merchantMap.set(t.merchant, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
      category: existing.category,
    });
  });

  return Array.from(merchantMap.entries())
    .map(([merchant, data]) => {
      let frequency: 'high' | 'medium' | 'low';
      if (data.count >= 5) frequency = 'high';
      else if (data.count >= 3) frequency = 'medium';
      else frequency = 'low';

      return {
        merchant,
        amount: data.amount,
        transactionCount: data.count,
        category: data.category,
        frequency,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 20); // Top 20 merchants
}

function calculateMonthlyStats(transactions: ParsedTransaction[]): MonthlyStats {
  const debitTransactions = transactions.filter(t => t.type === 'debit');
  const creditTransactions = transactions.filter(t => t.type === 'credit');

  const totalSpending = debitTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = creditTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalSpending;

  const impulseTransactions = transactions.filter(t => t.isImpulse);
  const impulseSpending = impulseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const essentialTransactions = transactions.filter(t => isEssentialCategory(t.category));
  const essentialSpending = essentialTransactions.reduce((sum, t) => sum + t.amount, 0);

  const discretionarySpending = totalSpending - essentialSpending;

  return {
    totalSpending,
    totalIncome,
    netSavings,
    transactionCount: transactions.length,
    averageTransaction: transactions.length > 0 ? totalSpending / transactions.length : 0,
    impulseSpending,
    essentialSpending,
    discretionarySpending,
  };
}
