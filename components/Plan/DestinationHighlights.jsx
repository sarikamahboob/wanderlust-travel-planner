import {
    Croissant,
    Crown,
    Frame,
    Lightbulb,
    TowerControl,
    Wallet,
} from 'lucide-react';

const iconMap = {
  'tower-control': TowerControl,
  frame: Frame,
  crown: Crown,
  croissant: Croissant,
  lightbulb: Lightbulb,
  wallet: Wallet,
};

const colorClasses = {
  emerald: 'bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600',
  orange: 'bg-orange-50 group-hover:bg-orange-100 text-orange-500',
  blue: 'bg-blue-50 group-hover:bg-blue-100 text-blue-500',
  purple: 'bg-purple-50 group-hover:bg-purple-100 text-purple-500',
  yellow: 'bg-yellow-50 group-hover:bg-yellow-100 text-yellow-600',
  rose: 'bg-rose-50 group-hover:bg-rose-100 text-rose-500',
};

const ratingColorClasses = {
  emerald: 'bg-emerald-100 text-emerald-800',
  orange: 'bg-orange-100 text-orange-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  rose: 'bg-rose-100 text-rose-800',
};

const DestinationHighlights = ({ highlights, destination, budget }) => {
  const getDefaultIcon = (type) => {
    const defaults = {
      attraction: 'tower-control',
      food: 'croissant',
      tips: 'lightbulb',
      budget: 'wallet',
    };
    return defaults[type] || 'tower-control';
  };

  const getDefaultColor = (type, index) => {
    if (type === 'attraction') {
      const colors = ['emerald', 'orange', 'blue'];
      return colors[index % colors.length];
    }
    if (type === 'food') return 'purple';
    if (type === 'tips') return 'yellow';
    if (type === 'budget') return 'rose';
    return 'emerald';
  };

  const displayHighlights = [...(highlights || [])];

  if (budget && !displayHighlights.find((h) => h.type === 'budget')) {
    displayHighlights.push({
      type: 'budget',
      title: 'Budget Estimate',
      description: budget,
      icon: 'wallet',
      color: 'rose',
    });
  }

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-16 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
        <div className="max-w-2xl">
          <span className="text-emerald-600 font-medium tracking-wide uppercase text-xs mb-3 block">
            Destination Highlights
          </span>
          <h2 className="text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight mb-6">
            Essentials for your <br />
            {destination} Journey
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            We&apos;ve curated the must-see landmarks, crucial travel tips, and
            culinary experiences into one seamless plan. Don&apos;t just visit{' '}
            {destination}—live it.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {displayHighlights.map((highlight, index) => {
          const IconComponent =
            iconMap[highlight.icon || getDefaultIcon(highlight.type)] ||
            TowerControl;
          const color =
            highlight.color || getDefaultColor(highlight.type, index);
          const bgColorClass = colorClasses[color] || colorClasses.emerald;
          const ratingColorClass =
            ratingColorClasses[color] || ratingColorClasses.emerald;

          return (
            <div key={index} className="group">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-6 transition-colors ${bgColorClass}`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              {highlight.rating ? (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-medium text-slate-900 tracking-tight">
                    {highlight.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${ratingColorClass}`}
                  >
                    {highlight.rating}
                  </span>
                </div>
              ) : (
                <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">
                  {highlight.title}
                </h3>
              )}
              <p className="text-lg text-slate-500 leading-relaxed">
                {highlight.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DestinationHighlights;

