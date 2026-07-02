import { AssessmentNormalizedData, AIAnalysisResult, CategoryBreakdown, MerchantStats, MonthlyStats, AIProfileMeta } from './types';

export interface AIProfileResult {
  aiAnalysis: AIAnalysisResult;
  monthlyStats: MonthlyStats;
  categories: CategoryBreakdown[];
  merchants: MerchantStats[];
  generatedProfile: AIProfileMeta;
}

export async function generateAIProfileFromAssessment(
  data: AssessmentNormalizedData
): Promise<AIProfileResult> {
  const prompt = `
You are a financial wellness coach. Based on the following comprehensive financial assessment, generate a personalized profile for the user.

PERSONAL INFORMATION:
${JSON.stringify(data.personalInfo, null, 2)}

INCOME PROFILE:
${JSON.stringify(data.incomeProfile, null, 2)}

MONTHLY FIXED EXPENSES:
${JSON.stringify(data.fixedExpenses, null, 2)}

MONTHLY VARIABLE EXPENSES:
${JSON.stringify(data.variableExpenses, null, 2)}

SAVINGS & INVESTMENTS:
${JSON.stringify(data.savingsInvestments, null, 2)}

DEBT & LIABILITIES:
${JSON.stringify(data.debtLiabilities, null, 2)}

FINANCIAL GOALS:
${JSON.stringify(data.financialGoals, null, 2)}

SPENDING BEHAVIOR:
${JSON.stringify(data.spendingBehaviour, null, 2)}

Provide a JSON response with the following fields:
{
  "aiAnalysis": {
    "spendingSummary": "...",
    "monthlySpending": number,
    "categoryBreakdown": "...",
    "spendingHabits": "...",
    "frequentMerchants": "...",
    "largestExpenses": "...",
    "behavioralObservations": "...",
    "savingOpportunities": "...",
    "subscriptionDetection": "...",
    "spendingTrends": "...",
    "estimatedMonthlySavings": number,
    "personalizedRecommendations": ["..."],
    "financialHealthSummary": "...",
    "riskScore": number
  },
  "monthlyStats": {
    "totalSpending": number,
    "totalIncome": number,
    "netSavings": number,
    "transactionCount": number,
    "averageTransaction": number,
    "impulseSpending": number,
    "essentialSpending": number,
    "discretionarySpending": number
  },
  "categories": [
    {"category":"...","amount":number,"percentage":number,"transactionCount":number,"trend":"stable"}
  ],
  "merchants": [
    {"merchant":"...","amount":number,"transactionCount":number,"category":"...","frequency":"medium"}
  ],
  "generatedProfile": {
    "estimatedMonthlySpending": number,
    "estimatedMonthlySavings": number,
    "categoryDistribution": [
      {"category":"...","amount":number,"percentage":number,"transactionCount":number,"trend":"stable"}
    ],
    "financialHealthScore": number,
    "emergencyFundAdequacy": "...",
    "debtPressureAssessment": "...",
    "savingPotentialEstimate": "...",
    "behavioralRiskIndicators": "...",
    "topStrengths": ["..."],
    "topImprovementOpportunities": ["..."],
    "personalizedActionPlan": ["..."],
    "profileGeneratedAt": "..."
  }
}

Use the user's assessment data to estimate spending, savings, health score, emergency fund adequacy, debt pressure, savings potential, behavioral risks, strengths and improvement areas.
`;

  const response = await fetch('/api/talk2groq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'AI generation failed');
  }

  const jsonMatch = result.response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  const payload = JSON.parse(jsonMatch[0]);

  return {
    aiAnalysis: payload.aiAnalysis,
    monthlyStats: payload.monthlyStats,
    categories: payload.categories,
    merchants: payload.merchants,
    generatedProfile: payload.generatedProfile,
  };
}
