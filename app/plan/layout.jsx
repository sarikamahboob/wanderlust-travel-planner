import PlanFooter from '@/components/Plan/PlanFooter';

export default function PlanLayout({ children }) {
  return (
    <>
      {children}
      <PlanFooter />
    </>
  );
}
