import { connectDB } from '@/lib/mongodb';
import { generateUniqueSlug } from '@/lib/slug';
import TravelPlan from '@/models/TravelPlan';
import { revalidatePath } from 'next/cache';
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
          error:
            'Database connection failed. Please check your MongoDB connection string.',
          details:
            process.env.NODE_ENV === 'development'
              ? dbError.message
              : undefined,
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

    const isTravelRelated = travelKeywords.some(keyword =>
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

    let cleanedPrompt = normalizedPrompt
      .replace(
        /\b(make|create|plan|travel|trip|visit|tour|vacation|journey|explore|adventure|holiday|itinerary|for|to|in|a|an|the)\b/gi,
        ' '
      )
      .replace(/\b\d+\s*(?:day|days)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const destinationPatterns = [
      /(?:^|\s)([a-z]+(?:\s+[a-z]+)*?)(?:\s+\d+\s*day)/i,
      /(?:\d+\s*day\s+)([a-z]+(?:\s+[a-z]+)*?)(?:\s|$)/i,
      /(?:for|to|in)\s+([a-z]+(?:\s+[a-z]+)*?)(?:\s+\d+\s*day|\s*travel|\s*plan|$)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    ];

    for (const pattern of destinationPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        destination = match[1].trim();
        break;
      }
    }

    if (!destination || destination.length < 2) {
      const words = cleanedPrompt
        .split(/\s+/)
        .filter(
          word =>
            word.length > 2 &&
            !['plan', 'travel', 'trip', 'tour', 'make', 'create'].includes(
              word.toLowerCase()
            )
        );
      destination = words.slice(0, 3).join(' ').trim();
    }

    if (!destination || destination.length < 2) {
      const beforeDuration = prompt.split(/\d+\s*(?:day|days)/i)[0];
      destination = beforeDuration
        .replace(
          /\b(make|create|plan|travel|trip|visit|tour|for|to|in|a|an|the)\b/gi,
          ' '
        )
        .replace(/\s+/g, ' ')
        .trim();
    }

    if (!destination || destination.length < 2) {
      return NextResponse.json(
        {
          error:
            'Could not extract destination from prompt. Please specify a destination.',
        },
        { status: 400 }
      );
    }

    const normalizedDestinationForSearch = destination
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');

    const normalizedDestinationForStorage = normalizedDestinationForSearch
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const escapedDestination = normalizedDestinationForSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    let existingPlan = await TravelPlan.findOne({
      $or: [
        { destination: { $regex: new RegExp(`^${escapedDestination}$`, 'i') } },
        {
          destination: {
            $regex: new RegExp(`^${normalizedDestinationForStorage}$`, 'i'),
          },
        },
        {
          destination: {
            $regex: new RegExp(`\\b${escapedDestination}\\b`, 'i'),
          },
        },
      ],
      duration: duration,
    });

    if (!existingPlan && normalizedDestinationForSearch.split(' ').length > 0) {
      const firstWord = normalizedDestinationForSearch.split(' ')[0];
      existingPlan = await TravelPlan.findOne({
        destination: { $regex: new RegExp(`^${firstWord}\\b`, 'i') },
        duration: duration,
      });
    }

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
    const { fetchDestinationImage, fetchDayImage } =
      await import('@/lib/images');

    const travelPlanData = await generateTravelPlan(
      prompt,
      normalizedDestinationForStorage,
      duration
    );

    if (!travelPlanData) {
      return NextResponse.json(
        { error: 'Failed to generate travel plan. Please try again.' },
        { status: 500 }
      );
    }

    if (!travelPlanData || typeof travelPlanData !== 'object') {
      console.error('Invalid travelPlanData:', travelPlanData);
      return NextResponse.json(
        {
          error: 'Invalid travel plan data structure received',
          details: 'Travel plan data is missing or invalid',
        },
        { status: 500 }
      );
    }

    if (!travelPlanData.itinerary || !Array.isArray(travelPlanData.itinerary)) {
      console.error(
        'Invalid travelPlanData structure:',
        JSON.stringify(travelPlanData, null, 2)
      );
      return NextResponse.json(
        {
          error: 'Invalid travel plan data structure received',
          details: 'Itinerary is missing or not an array',
        },
        { status: 500 }
      );
    }

    const imageUrl = await fetchDestinationImage(
      normalizedDestinationForStorage
    );

    const itineraryWithImages = await Promise.all(
      travelPlanData.itinerary.map(async day => {
        if (day.imageUrl) {
          return day;
        }

        const firstActivity = day.activities?.[0]?.title || '';
        const dayImageUrl = await fetchDayImage(
          normalizedDestinationForStorage,
          day.dayNumber,
          firstActivity
        );

        return {
          ...day,
          imageUrl: dayImageUrl,
        };
      })
    );

    const slug = await generateUniqueSlug(
      normalizedDestinationForStorage,
      duration,
      TravelPlan
    );

    const newPlan = new TravelPlan({
      slug,
      destination: normalizedDestinationForStorage,
      duration,
      title: travelPlanData.title,
      description: travelPlanData.description,
      imageUrl: imageUrl || travelPlanData.imageUrl,
      highlights: travelPlanData.highlights || [],
      itinerary: itineraryWithImages,
      budget: travelPlanData.budget || null,
    });

    await newPlan.save();

    revalidatePath('/');

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
        details: JSON.stringify(
          {
            message: error.message,
            cause: error.cause ? error.cause.message : undefined,
            response: error.response
              ? JSON.stringify(error.response)
              : undefined,
          },
          null,
          2
        ),
      },
      { status: 500 }
    );
  }
}
