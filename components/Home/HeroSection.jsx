import { Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-center mb-10 space-y-4 max-w-2xl mx-auto animate-fade-in-up">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium mb-2">
        <Sparkles className="w-3 h-3" />
        <span>AI-Powered Itineraries</span>
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 tracking-tight leading-[1.1]">
        Where do you want to <br />
        go next?
      </h1>
      <p className="text-lg text-slate-500 font-normal">
        Describe your dream trip. We&apos;ll handle the logistics, hotels, and
        hidden gems.
      </p>
    </div>
  );
};

export default HeroSection;
