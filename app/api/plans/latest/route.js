import { connectDB } from '@/lib/mongodb';
import TravelPlan from '@/models/TravelPlan';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '4', 10);
    const maxLimit = Math.min(limit, 10);

    const plans = await TravelPlan.find()
      .sort({ createdAt: -1 })
      .limit(maxLimit)
      .select('slug destination duration title description imageUrl createdAt')
      .lean();

    return NextResponse.json(
      {
        plans: plans || [],
        count: plans.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching latest plans:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while fetching latest plans',
        details: error.message
      },
      { status: 500 }
    );
  }
}

