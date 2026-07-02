export function SocialProof() {
  const logos = ['Acme', 'Stripe', 'Linear', 'Vercel', 'Notion', 'Mercury'];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-500 mb-8">
          Trusted by growing professionals
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-xl font-semibold text-zinc-400 dark:text-zinc-600"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
