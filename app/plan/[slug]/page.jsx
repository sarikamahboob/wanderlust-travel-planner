import DestinationHighlights from '@/components/Plan/DestinationHighlights';
import Itinerary from '@/components/Plan/Itinerary';
import PlanHeroSection from '@/components/Plan/PlanHeroSection';
import PlanNavbar from '@/components/Plan/PlanNavbar';
import { notFound } from 'next/navigation';

async function getPlanData(slug) {
  try {
    const { connectDB } = await import('@/lib/mongodb');
    const TravelPlan = (await import('@/models/TravelPlan')).default;
    
    await connectDB();
    const plan = await TravelPlan.findOne({ slug }).lean();

    if (!plan) {
      return null;
    }

    return plan;
  } catch (error) {
    console.error('Error fetching plan:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const plan = await getPlanData(params.slug);

  if (!plan) {
    return {
      title: 'Travel Plan Not Found',
    };
  }

  const title = `${plan.title} - ${plan.duration} Day Travel Plan`;
  const description = plan.description || `A ${plan.duration}-day travel plan for ${plan.destination}`;
  const imageUrl = plan.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/plan/${params.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: plan.title,
        },
      ],
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

const PlanPage = async ({ params }) => {
  const plan = await getPlanData(params.slug);

  if (!plan) {
    notFound();
  }

  return (
    <>
      <PlanNavbar slug={params.slug} title={plan.title} />
      <PlanHeroSection
        title={plan.title}
        description={plan.description}
        duration={plan.duration}
        imageUrl={plan.imageUrl}
        destination={plan.destination}
      />
      <DestinationHighlights
        highlights={plan.highlights}
        destination={plan.destination}
        budget={plan.budget}
      />
      <Itinerary
        itinerary={plan.itinerary}
        duration={plan.duration}
        destination={plan.destination}
      />
    </>
  );
};

export default PlanPage;
