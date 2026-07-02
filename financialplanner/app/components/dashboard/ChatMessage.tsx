'use client';

import { ChatMessage as ChatMessageType } from '../../../lib/types/ai-coach';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-zinc-900 dark:bg-blue-600 text-white rounded-br-none'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p className={`text-xs mt-2 ${
          isUser 
            ? 'text-zinc-400' 
            : 'text-zinc-500 dark:text-zinc-400'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
