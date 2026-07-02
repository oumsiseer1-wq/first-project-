import { NextResponse } from 'next/server';

// System prompt for the AI Coach - cannot be overridden by frontend
const SYSTEM_PROMPT = `You are MindSpend AI, a professional, supportive, and encouraging personal finance coach.

Your primary goal is to help users build healthier financial habits through education, budgeting, goal planning, and positive reinforcement.

You are not a financial advisor, accountant, lawyer, therapist, or psychologist.

Never provide investment recommendations, tax advice, legal advice, or guarantees about financial outcomes.

Your personality should be:
• Friendly
• Professional
• Supportive
• Encouraging
• Calm
• Honest
• Practical

Never shame users for their spending.

Always explain recommendations with clear reasoning.

Celebrate positive progress, even if it is small.

When users ask questions about budgeting or saving, provide practical, actionable steps.

When discussing spending habits, focus on improving future decisions rather than criticizing past ones.

When appropriate, recommend setting savings goals, reducing unnecessary recurring expenses, building emergency savings, and improving long-term financial habits.

If the user asks something outside your expertise, politely explain your limitations and encourage consulting an appropriate professional.

Always respond in a conversational tone suitable for an AI financial coach.`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface FinancialContext {
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

interface CoachRequest {
  messages: ChatMessage[];
  financialContext?: FinancialContext;
  userMessage: string;
}

function buildFinancialContextPrompt(context?: FinancialContext): string {
  if (!context) {
    return '';
  }

  const lines: string[] = [];
  lines.push('\n--- User Financial Context ---');

  if (context.monthlyIncome) {
    lines.push(`Monthly Income: $${context.monthlyIncome.toLocaleString()}`);
  }
  if (context.monthlyExpenses) {
    lines.push(`Monthly Expenses: $${context.monthlyExpenses.toLocaleString()}`);
  }
  if (context.monthlySavings) {
    lines.push(`Monthly Savings: $${context.monthlySavings.toLocaleString()}`);
  }
  if (context.emergencyFundAmount) {
    lines.push(`Emergency Fund: $${context.emergencyFundAmount.toLocaleString()}`);
  }
  if (context.creditCardDebt) {
    lines.push(`Credit Card Debt: $${context.creditCardDebt.toLocaleString()}`);
  }
  if (context.totalDebt) {
    lines.push(`Total Debt: $${context.totalDebt.toLocaleString()}`);
  }
  if (context.financialHealthScore) {
    lines.push(`Financial Health Score: ${context.financialHealthScore}/100`);
  }
  if (context.savingsGoals && context.savingsGoals.length > 0) {
    lines.push('Savings Goals:');
    context.savingsGoals.forEach(goal => {
      const progress = (goal.current / goal.target) * 100;
      lines.push(`  - ${goal.name}: $${goal.current.toLocaleString()} / $${goal.target.toLocaleString()} (${progress.toFixed(0)}%)`);
    });
  }
  if (context.spendingByCategory) {
    lines.push('Spending by Category:');
    Object.entries(context.spendingByCategory).forEach(([category, amount]) => {
      lines.push(`  - ${category}: $${(amount as number).toLocaleString()}`);
    });
  }
  lines.push('--- End Financial Context ---\n');

  return lines.join('\n');
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CoachRequest;
    const { messages, financialContext, userMessage } = body;

    if (!userMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'User message is required.',
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'GROQ_API_KEY is not configured.',
        },
        { status: 500 }
      );
    }

    // Build the messages array with system prompt and conversation history
    const systemContent = SYSTEM_PROMPT + buildFinancialContextPrompt(financialContext);
    
    const messagesForGroq: ChatMessage[] = [
      {
        role: 'system',
        content: systemContent,
      },
      // Include previous conversation history
      ...(Array.isArray(messages) ? messages.filter((m): m is ChatMessage => 
        m && typeof m === 'object' && 'role' in m && 'content' in m
      ) : []),
      // Add the current user message
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messagesForGroq,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Groq request failed');
    }

    const responseText = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      response: responseText,
    });
  } catch (error: unknown) {
    console.error('Groq Error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}