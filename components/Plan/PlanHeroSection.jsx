import { Clock } from 'lucide-react';
import Image from 'next/image';

const PlanHeroSection = ({ title, description, duration, imageUrl, destination }) => {
  return (
    <header className="relative w-full h-[85vh] min-h-[600px] overflow-hidden group">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`${destination} Landscape`}
          fill
          className="object-cover transform scale-105 group-hover:scale-100 ease-in-out duration-700"
          priority
          sizes="100vw"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-black/30"></div>

      <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 flex flex-col items-start gap-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-medium drop-shadow-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>{duration} {duration === 1 ? 'Day' : 'Days'}</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl drop-shadow-lg font-medium text-white tracking-tight leading-[1.1]">
          {title ? (
            (() => {
              const words = title.split(' ');
              if (words.length > 3) {
                const midPoint = Math.ceil(words.length / 2);
                return (
                  <>
                    {words.slice(0, midPoint).join(' ')} <br />
                    <span className="text-emerald-400">
                      {words.slice(midPoint).join(' ')}
                    </span>
                  </>
                );
              } else if (words.length > 1) {
                return (
                  <>
                    {words[0]} <br />
                    <span className="text-emerald-400">
                      {words.slice(1).join(' ')}
                    </span>
                  </>
                );
              } else {
                return <>{title}</>;
              }
            })()
          ) : (
            <>
              {destination} <br />
              <span className="text-emerald-400">Adventure</span>
            </>
          )}
        </h1>

        <p className="text-lg text-gray-50 max-w-2xl drop-shadow-lg font-normal leading-relaxed">
          {description ||
            `Experience the beauty and culture of ${destination}. Discover hidden gems and create unforgettable memories.`}
        </p>
      </div>
    </header>
  );
};

export default PlanHeroSection;
