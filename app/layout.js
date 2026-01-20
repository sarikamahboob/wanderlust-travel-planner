import HomeFooter from '@/components/Home/HomeFooter';
import { Inter } from 'next/font/google';
import HomeNavbar from '../components/Home/HomeNavbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export const metadata = {
  title: 'Wanderlust - AI Trip Planner',
  description: 'Wanderlust - AI Trip Planner',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-white text-slate-600 antialiased selection:bg-emerald-100 selection:text-emerald-900 relative`}
      >
        <div class="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#ecfdf5_100%)]"></div>
        <HomeNavbar />
        {children}
        <HomeFooter />
      </body>
    </html>
  );
}
