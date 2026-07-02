export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FinancialContext {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  monthlySavings?: number;
  emergencyFundAmount?: number;
  creditCardDebt?: number;
  totalDebt?: number;
  financialHealthScore?: number;
  savingsGoals?: Array<{ name: string; target: number; current: number }>;
  spendingByCategory?: Record<string, number>;
}

export interface CoachAPIRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  financialContext?: FinancialContext;
  userMessage: string;
}

export interface CoachAPIResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export const STARTER_QUESTIONS = [
  'Help me create a monthly budget.',
  'How can I save more each month?',
  'How close am I to reaching my savings goal?',
  'Explain where I might reduce expenses.',
  'Give me three money-saving challenges for this week.',
];
