import { connectDB } from '@/lib/mongodb';
import TravelPlan from '@/models/TravelPlan';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    await connectDB();

    const plan = await TravelPlan.findOne({ slug });

    if (!plan) {
      return NextResponse.json(
        { error: 'Travel plan not found' },
        { status: 404 }
      );
    }

    const planData = plan.toObject();

    return NextResponse.json(planData, { status: 200 });
  } catch (error) {
    console.error('Error fetching travel plan:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while fetching the travel plan',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

