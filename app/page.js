'use client';

import { useState } from 'react';
import AllPlansModal from '@/components/Home/AllPlansModal';
import Feature from '@/components/Home/Feature';
import HeroSection from '@/components/Home/HeroSection';
import PromptField from '@/components/Home/PromptField';

export default function Home() {
  const [isAllPlansOpen, setIsAllPlansOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12 relative w-full max-w-7xl mx-auto">
      <HeroSection />
      <PromptField />
      <Feature onOpenAllPlans={() => setIsAllPlansOpen(true)} />
      <AllPlansModal
        isOpen={isAllPlansOpen}
        onClose={() => setIsAllPlansOpen(false)}
      />
    </main>
  );
}
