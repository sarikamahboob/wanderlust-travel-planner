import { Map } from 'lucide-react';
import Link from 'next/link';

const PlanFooter = () => {
  return (
    <footer className="bg-white pt-24 pb-12 px-6 lg:px-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <Map className="w-6 h-6" />
            <span className="text-lg font-medium tracking-tight">
              Wanderlust
            </span>
          </div>
          <p className="text-lg text-slate-500 mb-8">
            Curating the world&apos;s best quick escapes. Plan less, live more.
          </p>
          <div className="flex gap-4">
            <i
              data-lucide="instagram"
              className="w-6 h-6 text-slate-400 hover:text-slate-900 cursor-pointer transition-colors"
            ></i>
            <i
              data-lucide="twitter"
              className="w-6 h-6 text-slate-400 hover:text-slate-900 cursor-pointer transition-colors"
            ></i>
            <i
              data-lucide="facebook"
              className="w-6 h-6 text-slate-400 hover:text-slate-900 cursor-pointer transition-colors"
            ></i>
          </div>
        </div>

        <div className="flex gap-16 flex-wrap">
          <div>
            <h4 className="text-slate-900 font-medium mb-4">Company</h4>
            <ul className="space-y-3 text-lg text-slate-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-medium mb-4">Resources</h4>
            <ul className="space-y-3 text-lg text-slate-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-medium mb-4">Legal</h4>
            <ul className="space-y-3 text-lg text-slate-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex justify-between text-slate-400 text-sm">
        <p>© 2026 Wanderlust Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default PlanFooter;
