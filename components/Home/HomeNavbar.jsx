import { Map } from 'lucide-react';

const HomeNavbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full py-6 px-6 lg:px-12 flex justify-between items-center">
      <div className="flex items-center gap-2 text-slate-900">
        <Map className="w-6 h-6 text-emerald-600" />
        <span className="text-lg font-medium tracking-tight">Wanderlust</span>
      </div>
    </nav>
  );
};

export default HomeNavbar;
