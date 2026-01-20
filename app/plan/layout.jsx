import PlanFooter from '@/components/Plan/PlanFooter';

export default function PlanLayout({ children }) {
  return (
    <body className='bg-white text-slate-600 antialiased selection:bg-emerald-100 selection:text-emerald-900'>
      {children}
      <PlanFooter />
    </body>
  );
}
