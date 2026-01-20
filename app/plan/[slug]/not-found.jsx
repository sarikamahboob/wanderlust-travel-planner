import { Map } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6 text-slate-900">
          <Map className="w-8 h-8" />
          <span className="text-2xl font-medium tracking-tight">Wanderlust</span>
        </div>
        <h1 className="text-4xl font-medium text-slate-900 mb-4">
          Travel Plan Not Found
        </h1>
        <p className="text-lg text-slate-500 mb-8">
          The travel plan you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

