'use client';

import HomeFooter from '@/components/Home/HomeFooter';
import HomeNavbar from '@/components/Home/HomeNavbar';
import { usePathname } from 'next/navigation';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isPlanPage = pathname?.startsWith('/plan/');

  return (
    <>
      {!isPlanPage && <HomeNavbar />}
      {children}
      {!isPlanPage && <HomeFooter />}
    </>
  );
}

