// First, create the API route
// client/app/api/builders/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../../server/src/db';
import Builder from '../../../../server/src/models/Builder';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const builder = await Builder.findOne({ slug: params.slug }).lean();
    
    if (!builder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(JSON.parse(JSON.stringify(builder)));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch builder' },
      { status: 500 }
    );
  }
}