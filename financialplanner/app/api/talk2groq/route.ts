import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
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
          messages: [{ role: 'user', content: prompt || 'ok' }],
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