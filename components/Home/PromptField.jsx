'use client';

import { ArrowRight, Bot, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PromptField = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const examplePrompts = [
    '3 Days in Tokyo',
    'Wine tasting in Tuscany',
    'Hiking in Patagonia',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a travel prompt');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate travel plan');
      }

      router.push(`/plan/${data.slug}`);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <div className="w-full max-w-3xl mb-24 relative group z-20">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 via-teal-100 to-emerald-100 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>

      <form onSubmit={handleSubmit}>
        <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex items-start p-3 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
          <div className="p-4 pt-5">
            <Bot className="w-7 h-7 text-emerald-600" />
          </div>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-lg text-slate-900 placeholder:text-slate-400 py-4 px-3 resize-none h-[140px] leading-relaxed"
            placeholder="e.g. A romantic 4-day trip to Paris in Spring, focusing on art museums and hidden cafes..."
            disabled={isLoading}
          />
          <div className="p-2 pt-3">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-slate-900 text-white p-3.5 rounded-xl hover:bg-emerald-600 transition-all duration-300 shadow-md group-focus-within:bg-emerald-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-center">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-center gap-3 mt-4 text-xs font-medium text-slate-500">
        {examplePrompts.map((example, index) => (
          <div key={index} className="flex items-center gap-3">
            {index > 0 && (
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            )}
            <span
              onClick={() => handleExampleClick(example)}
              className="hover:text-emerald-600 cursor-pointer transition-colors"
            >
              ✨ {example}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptField;
