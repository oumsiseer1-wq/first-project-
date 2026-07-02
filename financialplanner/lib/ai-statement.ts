import { AIAnalysisResult, NormalizedData } from './types';

export async function analyzeStatementWithAI(data: NormalizedData): Promise<AIAnalysisResult> {
  try {
    const prompt = `
You are a behavioral finance AI coach. Analyze the following financial transaction data and provide comprehensive insights:

TRANSACTIONS (sample):
${JSON.stringify(data.transactions.slice(0, 30), null, 2)}

MONTHLY STATISTICS:
${JSON.stringify(data.monthlyStats, null, 2)}

CATEGORY BREAKDOWN:
${JSON.stringify(data.categories.slice(0, 10), null, 2)}

TOP MERCHANTS:
${JSON.stringify(data.merchants.slice(0, 10), null, 2)}

Provide a comprehensive analysis in the following JSON format:
{
  "spendingSummary": "2-3 sentence summary of overall spending behavior",
  "monthlySpending": number (total monthly spending),
  "categoryBreakdown": "analysis of spending by category",
  "spendingHabits": "description of spending patterns and habits",
  "frequentMerchants": "analysis of most frequently visited merchants",
  "largestExpenses": "description of largest expense categories",
  "behavioralObservations": "key behavioral insights from the data",
  "savingOpportunities": "identifiable opportunities for saving money",
  "subscriptionDetection": "identification of recurring subscription payments",
  "spendingTrends": "trends in spending over time",
  "estimatedMonthlySavings": number (estimated potential monthly savings),
  "personalizedRecommendations": ["list of 3-5 actionable recommendations"],
  "financialHealthSummary": "overall assessment of financial health",
  "riskScore": number between 0-100 (higher = more financial risk)
}

Be specific, actionable, and encouraging. Focus on behavioral insights rather than just numbers.
`;

    const response = await fetch('/api/talk2groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'AI analysis failed');
    }

    // Parse AI response
    const jsonMatch = result.response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate and sanitize
    const ensureStringArray = (value: any): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.filter(item => typeof item === 'string');
      }
      if (typeof value === 'object') {
        return Object.values(value).filter(item => typeof item === 'string');
      }
      return [];
    };

    return {
      spendingSummary: typeof analysis.spendingSummary === 'string' ? analysis.spendingSummary : '',
      monthlySpending: typeof analysis.monthlySpending === 'number' ? analysis.monthlySpending : data.monthlyStats.totalSpending,
      categoryBreakdown: typeof analysis.categoryBreakdown === 'string' ? analysis.categoryBreakdown : '',
      spendingHabits: typeof analysis.spendingHabits === 'string' ? analysis.spendingHabits : '',
      frequentMerchants: typeof analysis.frequentMerchants === 'string' ? analysis.frequentMerchants : '',
      largestExpenses: typeof analysis.largestExpenses === 'string' ? analysis.largestExpenses : '',
      behavioralObservations: typeof analysis.behavioralObservations === 'string' ? analysis.behavioralObservations : '',
      savingOpportunities: typeof analysis.savingOpportunities === 'string' ? analysis.savingOpportunities : '',
      subscriptionDetection: typeof analysis.subscriptionDetection === 'string' ? analysis.subscriptionDetection : '',
      spendingTrends: typeof analysis.spendingTrends === 'string' ? analysis.spendingTrends : '',
      estimatedMonthlySavings: typeof analysis.estimatedMonthlySavings === 'number' ? analysis.estimatedMonthlySavings : 0,
      personalizedRecommendations: ensureStringArray(analysis.personalizedRecommendations),
      financialHealthSummary: typeof analysis.financialHealthSummary === 'string' ? analysis.financialHealthSummary : '',
      riskScore: typeof analysis.riskScore === 'number' ? analysis.riskScore : 50,
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return getFallbackAnalysis(data);
  }
}

function getFallbackAnalysis(data: NormalizedData): AIAnalysisResult {
  return {
    spendingSummary: `Your monthly spending is $${data.monthlyStats.totalSpending.toFixed(2)} with ${data.monthlyStats.transactionCount} transactions.`,
    monthlySpending: data.monthlyStats.totalSpending,
    categoryBreakdown: `Top spending category is ${data.categories[0]?.category || 'Uncategorized'} at ${data.categories[0]?.percentage.toFixed(1) || 0}% of total spending.`,
    spendingHabits: 'Your spending shows a mix of essential and discretionary purchases.',
    frequentMerchants: `Most frequent merchant is ${data.merchants[0]?.merchant || 'Unknown'}.`,
    largestExpenses: `Largest expense category is ${data.categories[0]?.category || 'Uncategorized'}.`,
    behavioralObservations: `Impulse spending accounts for $${data.monthlyStats.impulseSpending.toFixed(2)} this month.`,
    savingOpportunities: 'Consider reducing discretionary spending on weekends.',
    subscriptionDetection: 'Review your recurring subscriptions for potential savings.',
    spendingTrends: 'Spending appears consistent with typical patterns.',
    estimatedMonthlySavings: Math.max(0, data.monthlyStats.impulseSpending * 0.5),
    personalizedRecommendations: [
      'Implement a 24-hour rule for non-essential purchases',
      'Set weekly spending limits for discretionary categories',
      'Review and cancel unused subscriptions',
    ],
    financialHealthSummary: 'Your financial health is stable with room for optimization.',
    riskScore: Math.min(100, Math.max(0, (data.monthlyStats.impulseSpending / data.monthlyStats.totalSpending) * 100)),
  };
}
