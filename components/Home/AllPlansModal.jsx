'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  SortDesc,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'az', label: 'A - Z' },
  { value: 'za', label: 'Z - A' },
  { value: 'duration-asc', label: 'Short Trip First' },
  { value: 'duration-desc', label: 'Long Trip First' },
];

const ITEMS_PER_PAGE = 6;

export default function AllPlansModal({ isOpen, onClose }) {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        search: debouncedSearch,
        sortBy,
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(`/api/plans?${params}`, {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setPlans(data.plans || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, sortBy, page]);

  useEffect(() => {
    if (isOpen) fetchPlans();
  }, [isOpen, fetchPlans]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy]);

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                All Travel Plans
              </h2>
              <p className="text-sm text-slate-500">{total} plans found</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search destinations or titles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all [&::-webkit-search-cancel-button]:hidden"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>

            <div className="relative">
              <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-48 pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <SortDesc className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                No plans found
              </h3>
              <p className="text-slate-500">
                {search
                  ? 'Try adjusting your search terms'
                  : 'Create your first travel plan above!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map(plan => (
                <Link
                  key={plan._id || plan.slug}
                  href={`/plan/${plan.slug}`}
                  onClick={onClose}
                  className="group block rounded-2xl overflow-hidden border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {plan.imageUrl ? (
                      <Image
                        src={plan.imageUrl}
                        alt={plan.title || plan.destination}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                        <Calendar className="w-3 h-3" />
                        {plan.duration} {plan.duration === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {plan.title || plan.destination}
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="capitalize">{plan.destination}</span>
                    </div>

                    {plan.description && (
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum
                            ? 'bg-emerald-500 text-white'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
