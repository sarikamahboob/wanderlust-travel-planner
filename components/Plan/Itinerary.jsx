import Image from 'next/image';

const Itinerary = ({ itinerary, duration, destination }) => {
  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  return (
    <section className="bg-emerald-950 py-24 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-emerald-400 font-medium tracking-wide uppercase text-xs mb-3 block">
              Travel Plan
            </span>
            <h2 className="text-4xl lg:text-5xl font-medium text-white tracking-tight">
              Your {duration}-Day <br />
              {destination} Itinerary
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {itinerary.map((day, index) => (
            <div
              key={day.dayNumber || index}
              className="group relative rounded-3xl overflow-hidden bg-emerald-900/50 border border-emerald-800/50 hover:border-emerald-700 transition-all duration-300"
            >
              <div className="aspect-[16/9] w-full overflow-hidden relative">
                <Image
                  src={day.imageUrl || '/placeholder.jpg'}
                  alt={day.title || `Day ${day.dayNumber}`}
                  fill
                  className="object-cover group-hover:scale-105 duration-700 opacity-90"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-medium text-white mb-4 tracking-tight">
                  {day.title || `Day ${String(day.dayNumber).padStart(2, '0')}`}
                </h3>

                <div className="space-y-4 mb-6">
                  {day.activities && day.activities.length > 0 ? (
                    day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex gap-4">
                        <span className="text-emerald-400 font-mono text-sm w-16 pt-0.5 whitespace-nowrap">
                          {activity.time}
                        </span>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {activity.title}
                          </p>
                          {activity.description && (
                            <p className="text-emerald-200/60 text-xs">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-emerald-200/60 text-sm">
                      No activities scheduled for this day.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Itinerary;

