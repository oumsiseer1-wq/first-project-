import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Benefits } from './components/Benefits';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <Benefits />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
