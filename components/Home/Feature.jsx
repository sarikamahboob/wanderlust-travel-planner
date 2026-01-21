'use client';

import { Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const hoverColorClasses = [
  'group-hover:text-emerald-200',
  'group-hover:text-orange-200',
  'group-hover:text-blue-200',
];

const Feature = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/plans/latest?limit=3', {
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error('Failed to fetch latest plans:', response.statusText);
          setPlans([]);
          return;
        }

        const data = await response.json();
        setPlans(data.plans || []);
      } catch (error) {
        console.error('Error fetching latest plans:', error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-slate-500 text-lg">Loading latest plans...</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-slate-500 text-lg">
          No travel plans yet. Create your first plan above!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-[fadeIn_0.8s_ease-out_0.5s_forwards]">
      {plans.map((plan, index) => (
        <Link
          key={plan._id || plan.slug}
          href={`/plan/${plan.slug}`}
          className="group relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer"
        >
          {plan.imageUrl && (
            <Image
              src={plan.imageUrl}
              alt={plan.title || plan.destination}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {plan.duration} {plan.duration === 1 ? 'Day' : 'Days'}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3
              className={`text-2xl font-medium text-white tracking-tight leading-tight mb-1 ${hoverColorClasses[index % hoverColorClasses.length]} transition-colors`}
            >
              {plan.title ? (
                (() => {
                  const words = plan.title.split(' ');
                  if (words.length > 3) {
                    const midPoint = Math.ceil(words.length / 2);
                    return (
                      <>
                        {words.slice(0, midPoint).join(' ')} <br />
                        {words.slice(midPoint).join(' ')}
                      </>
                    );
                  } else if (words.length > 1) {
                    return (
                      <>
                        {words[0]} <br />
                        {words.slice(1).join(' ')}
                      </>
                    );
                  } else {
                    return <>{plan.title}</>;
                  }
                })()
              ) : (
                <>
                  {plan.destination} <br />
                  Adventure
                </>
              )}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2">
              {plan.description ||
                `Explore ${plan.destination} with this amazing ${plan.duration}-day travel plan.`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Feature;
