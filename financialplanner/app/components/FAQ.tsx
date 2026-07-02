'use client';

import { useState } from 'react';
import { Section } from './ui/section';
import { ChevronDownIcon } from './ui/icons';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How does Mindful Spend work?',
      answer: 'Mindful Spend uses AI to analyze your spending patterns and provide real-time guidance when you\'re about to make a purchase. By understanding your behavior, we help you make more intentional financial decisions.',
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Yes, we use bank-level encryption to protect your data. We never sell your information to third parties, and you can delete your data at any time. Your privacy is our top priority.',
    },
    {
      question: 'Do I need to connect my bank accounts?',
      answer: 'No, you can use Mindful Spend without connecting bank accounts by manually logging your purchases. However, connecting accounts provides more accurate insights and automated tracking.',
    },
    {
      question: 'How is this different from budgeting apps?',
      answer: 'Traditional budgeting apps focus on tracking past spending. Mindful Spend focuses on preventing future spending by providing behavioral insights and coaching at the moment of decision.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time with no questions asked. We believe in giving you full control over your financial journey.',
    },
  ];

  return (
    <Section className="bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-4">
          Frequently asked questions
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Everything you need to know about Mindful Spend.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="font-medium text-zinc-900 dark:text-white">
                {faq.question}
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 text-zinc-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
