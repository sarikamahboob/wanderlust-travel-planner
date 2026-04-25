import { connectDB } from '@/lib/mongodb';
import TravelPlan from '@/models/TravelPlan';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    const query = {};
    if (search) {
      query.$or = [
        { destination: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };
    if (sortBy === 'az') sort = { title: 1 };
    if (sortBy === 'za') sort = { title: -1 };
    if (sortBy === 'duration-asc') sort = { duration: 1 };
    if (sortBy === 'duration-desc') sort = { duration: -1 };

    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
      TravelPlan.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          'slug destination duration title description imageUrl createdAt'
        )
        .lean(),
      TravelPlan.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        plans: plans || [],
        count: plans.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while fetching plans',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
