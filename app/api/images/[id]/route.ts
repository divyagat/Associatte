import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import UploadedImage from '@/lib/models/UploadedImage';

// Serves an image previously stored in MongoDB by /api/upload.
// URL shape: /api/images/<mongoId>

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid image id' }, { status: 400 });
    }

    await dbConnect();
    const image = await UploadedImage.findById(id).lean();

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // `data` comes back as either a Node Buffer or a BSON Binary; normalise it.
    const raw: any = (image as any).data;
    const buffer: Buffer = Buffer.isBuffer(raw)
      ? raw
      : raw?.buffer
        ? Buffer.from(raw.buffer)
        : Buffer.from(raw);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': (image as any).contentType || 'application/octet-stream',
        'Content-Length': String(buffer.length),
        // Images are immutable once uploaded, so cache aggressively.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Image serve error:', error?.message || error);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
