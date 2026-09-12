import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import UploadedImage from '@/lib/models/UploadedImage';

// Serves an image previously stored in MongoDB by /api/upload.
// URL shape: /api/images/<mongoId>

// `data` comes back from `.lean()` as either a Node Buffer or a BSON Binary
// (which wraps its bytes in a `.buffer` property), depending on the driver.
interface LeanUploadedImage {
  data: Buffer | { buffer: ArrayBufferLike };
  contentType: string;
}

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
    const image = await UploadedImage.findById(id).lean<LeanUploadedImage>();

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const raw = image.data;
    const buffer: Buffer = Buffer.isBuffer(raw)
      ? raw
      : raw?.buffer
        ? Buffer.from(raw.buffer)
        : Buffer.from(raw as unknown as Uint8Array);

    // NextResponse's body type accepts a Uint8Array (BufferSource) but not a
    // Node Buffer directly, so hand it a plain Uint8Array view of the bytes.
    const body = new Uint8Array(buffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': image.contentType || 'application/octet-stream',
        'Content-Length': String(body.length),
        // Images are immutable once uploaded, so cache aggressively.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : error;
    console.error('Image serve error:', message);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
