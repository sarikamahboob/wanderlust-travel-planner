'use client';

import { Map, Share2 } from 'lucide-react';
import Link from 'next/link';

const PlanNavbar = ({ slug, title }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'Travel Plan',
        text: `Check out this amazing travel plan: ${title}`,
        url: window.location.href,
      });
    } else {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'facebook-share-dialog',
      'width=626,height=436'
    );
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full py-6 px-6 lg:px-12 flex justify-between items-center text-white">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6" />
          <span className="text-lg font-medium tracking-tight">Wanderlust</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={handleFacebookShare}
          className="bg-white text-emerald-950 text-sm font-medium px-5 py-2 rounded-full hover:bg-emerald-50 transition-colors flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </nav>
  );
};

export default PlanNavbar;
