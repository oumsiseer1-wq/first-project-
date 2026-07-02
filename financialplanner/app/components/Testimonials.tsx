import { Section } from './ui/section';
import { Card, CardHeader, CardContent } from './ui/card';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Designer',
      content: "Mindful Spend completely changed how I think about money. I used to make impulse purchases all the time, but now I pause and reflect. The AI insights are incredibly accurate.",
    },
    {
      name: 'Marcus Johnson',
      role: 'Software Engineer',
      content: "Finally, a financial app that doesn't feel like a chore. The behavioral coaching actually helps me understand my spending patterns instead of just tracking them.",
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      content: "I've saved over $400 in my first month. The weekly reports help me see my progress and the AI guidance feels like having a personal financial coach.",
    },
  ];

  return (
    <Section>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-white mb-4">
          Loved by thousands
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          See what our users have to say about their experience.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600" />
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {testimonial.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
