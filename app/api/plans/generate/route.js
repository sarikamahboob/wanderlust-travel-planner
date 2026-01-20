import { connectDB } from '@/lib/mongodb';
import { generateUniqueSlug } from '@/lib/slug';
import TravelPlan from '@/models/TravelPlan';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please check your MongoDB connection string.',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 500 }
      );
    }

    const normalizedPrompt = prompt.trim().toLowerCase();

    const travelKeywords = [
      'travel',
      'trip',
      'visit',
      'tour',
      'vacation',
      'journey',
      'destination',
      'itinerary',
      'explore',
      'adventure',
      'holiday',
      'sightseeing',
      'days',
      'day',
    ];

    const isTravelRelated = travelKeywords.some((keyword) =>
      normalizedPrompt.includes(keyword)
    );

    if (!isTravelRelated) {
      return NextResponse.json(
        {
          error:
            'Please provide a travel-related prompt. Include destination and duration (e.g., "4 days in Paris")',
        },
        { status: 400 }
      );
    }

    const durationMatch = normalizedPrompt.match(/(\d+)\s*(?:day|days)/);
    const duration = durationMatch ? parseInt(durationMatch[1], 10) : null;

    if (!duration || duration < 1) {
      return NextResponse.json(
        {
          error:
            'Please specify the duration of your trip in days (e.g., "4 days", "7 days")',
        },
        { status: 400 }
      );
    }

    let destination = '';
    const destinationPatterns = [
      /(?:to|in|visit|explore|travel to)\s+([a-z\s]+?)(?:\s+(?:for|in|with|,|$))/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    ];

    for (const pattern of destinationPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        destination = match[1].trim();
        break;
      }
    }

    if (!destination) {
      destination = prompt
        .split(/\s+(?:for|in|days|day|trip|tour)/i)[0]
        .trim();
    }

    if (!destination || destination.length < 2) {
      return NextResponse.json(
        { error: 'Could not extract destination from prompt. Please specify a destination.' },
        { status: 400 }
      );
    }

    const existingPlan = await TravelPlan.findOne({
      destination: { $regex: new RegExp(destination, 'i') },
      duration: duration,
    });

    if (existingPlan) {
      return NextResponse.json(
        {
          slug: existingPlan.slug,
          message: 'Plan found in database',
        },
        { status: 200 }
      );
    }

    const { generateTravelPlan } = await import('@/lib/gemini');
    const { fetchDestinationImage, fetchDayImage } = await import('@/lib/images');

    const travelPlanData = await generateTravelPlan(prompt, destination, duration);

    if (!travelPlanData) {
      return NextResponse.json(
        { error: 'Failed to generate travel plan. Please try again.' },
        { status: 500 }
      );
    }

    // Validate travelPlanData structure
    if (!travelPlanData || typeof travelPlanData !== 'object') {
      console.error('Invalid travelPlanData:', travelPlanData);
      return NextResponse.json(
        { 
          error: 'Invalid travel plan data structure received',
          details: 'Travel plan data is missing or invalid'
        },
        { status: 500 }
      );
    }

    if (!travelPlanData.itinerary || !Array.isArray(travelPlanData.itinerary)) {
      console.error('Invalid travelPlanData structure:', JSON.stringify(travelPlanData, null, 2));
      return NextResponse.json(
        { 
          error: 'Invalid travel plan data structure received',
          details: 'Itinerary is missing or not an array'
        },
        { status: 500 }
      );
    }

    const imageUrl = await fetchDestinationImage(destination);

    const itineraryWithImages = await Promise.all(
      travelPlanData.itinerary.map(async (day) => {
        if (day.imageUrl) {
          return day;
        }

        const firstActivity = day.activities?.[0]?.title || '';
        const dayImageUrl = await fetchDayImage(
          destination,
          day.dayNumber,
          firstActivity
        );

        return {
          ...day,
          imageUrl: dayImageUrl,
        };
      })
    );

    const slug = await generateUniqueSlug(destination, duration, TravelPlan);

    const newPlan = new TravelPlan({
      slug,
      destination,
      duration,
      title: travelPlanData.title,
      description: travelPlanData.description,
      imageUrl: imageUrl || travelPlanData.imageUrl,
      highlights: travelPlanData.highlights || [],
      itinerary: itineraryWithImages,
      budget: travelPlanData.budget || null,
    });

    await newPlan.save();

    return NextResponse.json(
      {
        slug: newPlan.slug,
        message: 'Travel plan generated successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error generating travel plan:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while generating the travel plan',
        details: error.details ? JSON.stringify(error.details, null, 2) : error.message,
      },
      { status: 500 }
    );
  }
}

