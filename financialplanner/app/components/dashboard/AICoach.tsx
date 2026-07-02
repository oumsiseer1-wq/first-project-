'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ChatMessage } from './ChatMessage';
import { BrainIcon, SendIcon } from '../ui/icons';
import { ChatMessage as ChatMessageType, FinancialContext, STARTER_QUESTIONS, CoachAPIRequest, CoachAPIResponse } from '../../../lib/types/ai-coach';

interface AICoachProps {
  financialContext?: FinancialContext;
}

export function AICoach({ financialContext }: AICoachProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      // Prepare messages for API (exclude timestamps)
      const apiMessages = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const request: CoachAPIRequest = {
        messages: apiMessages,
        financialContext,
        userMessage: messageText.trim(),
      };

      const response = await fetch('/api/talk2groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = (await response.json()) as CoachAPIResponse;

      if (!data.success || !data.response) {
        throw new Error(data.error || 'Failed to get response from AI Coach');
      }

      // Add assistant message to chat
      const assistantMessage: ChatMessageType = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('AI Coach error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BrainIcon className="w-6 h-6 text-zinc-900 dark:text-white" />
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            AI Financial Coach
          </h2>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          Get personalized financial guidance and budgeting tips
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col h-[500px]">
            {/* Chat history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BrainIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mb-4" />
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Ask me anything about your finances. I'm here to help!
                  </p>

                  {/* Starter questions */}
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    {STARTER_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSendMessage(question)}
                        className="text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-bl-none bg-zinc-100 dark:bg-zinc-800">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm max-w-xs">
                        {error}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setError(null)}
                          className="mt-2 h-6"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  placeholder="Ask me anything about your finances..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Press Enter to send. This coach provides general financial guidance only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
