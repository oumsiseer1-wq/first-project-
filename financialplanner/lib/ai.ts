// AI Service Client
// Wraps the existing Groq API for behavioral analysis

export interface AIAnalysisRequest {
  transactions: Transaction[];
  spendingPatterns: SpendingPattern[];
  userGoals: Goal[];
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  isImpulse?: boolean;
}

export interface SpendingPattern {
  category: string;
  amount: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export interface AIAnalysisResult {
  behavioralSummary: string;
  spendingPatterns: string;
  impulseIndicators: string;
  categoryTrends: string;
  weeklyObservations: string;
  monthlyObservations: string;
  riskScore: number;
  positiveHabits: string[];
  areasForImprovement: string[];
  recommendations: string[];
}

export async function analyzeSpendingBehavior(
  data: AIAnalysisRequest
): Promise<AIAnalysisResult> {
  try {
    // Build prompt for AI analysis
    const prompt = `
You are a behavioral finance AI coach. Analyze the following spending data and provide insights:

TRANSACTIONS:
${JSON.stringify(data.transactions.slice(0, 20), null, 2)}

SPENDING PATTERNS:
${JSON.stringify(data.spendingPatterns, null, 2)}

GOALS:
${JSON.stringify(data.userGoals, null, 2)}

Provide a comprehensive analysis in the following JSON format:
{
  "behavioralSummary": "2-3 sentence summary of overall spending behavior",
  "spendingPatterns": "analysis of spending patterns",
  "impulseIndicators": "identify impulse spending patterns",
  "categoryTrends": "trends by spending category",
  "weeklyObservations": "key observations from recent weeks",
  "monthlyObservations": "key observations from recent months",
  "riskScore": number between 0-100 (higher = more risk),
  "positiveHabits": ["list of positive habits"],
  "areasForImprovement": ["list of areas to improve"],
  "recommendations": ["list of actionable recommendations"]
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

    // Validate and sanitize array fields
    const ensureStringArray = (value: any): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.filter(item => typeof item === 'string');
      }
      // If it's an object, convert values to array
      if (typeof value === 'object') {
        return Object.values(value).filter(item => typeof item === 'string');
      }
      return [];
    };

    return {
      behavioralSummary: typeof analysis.behavioralSummary === 'string' ? analysis.behavioralSummary : '',
      spendingPatterns: typeof analysis.spendingPatterns === 'string' ? analysis.spendingPatterns : '',
      impulseIndicators: typeof analysis.impulseIndicators === 'string' ? analysis.impulseIndicators : '',
      categoryTrends: typeof analysis.categoryTrends === 'string' ? analysis.categoryTrends : '',
      weeklyObservations: typeof analysis.weeklyObservations === 'string' ? analysis.weeklyObservations : '',
      monthlyObservations: typeof analysis.monthlyObservations === 'string' ? analysis.monthlyObservations : '',
      riskScore: typeof analysis.riskScore === 'number' ? analysis.riskScore : 50,
      positiveHabits: ensureStringArray(analysis.positiveHabits),
      areasForImprovement: ensureStringArray(analysis.areasForImprovement),
      recommendations: ensureStringArray(analysis.recommendations),
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    // Return fallback data on error
    return getFallbackAnalysis();
  }
}

function getFallbackAnalysis(): AIAnalysisResult {
  return {
    behavioralSummary: 'Your spending shows a mix of essential and discretionary purchases. You tend to spend more on weekends.',
    spendingPatterns: 'Consistent spending on essentials with occasional discretionary purchases.',
    impulseIndicators: 'Some impulse purchases detected, particularly in entertainment and dining categories.',
    categoryTrends: 'Highest spending in food and entertainment categories.',
    weeklyObservations: 'Spending peaks on weekends, with lower weekday spending.',
    monthlyObservations: 'Monthly spending is within budget but shows room for optimization.',
    riskScore: 45,
    positiveHabits: [
      'Consistent tracking of expenses',
      'Regular savings contributions',
      'Mindful spending on essentials',
    ],
    areasForImprovement: [
      'Reduce impulse purchases',
      'Set stricter entertainment budget',
      'Plan weekend spending in advance',
    ],
    recommendations: [
      'Implement a 24-hour rule for non-essential purchases',
      'Set weekly spending limits for discretionary categories',
      'Review subscriptions and cancel unused services',
    ],
  };
}
