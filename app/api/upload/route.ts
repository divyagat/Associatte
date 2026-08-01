import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UploadedImage from '@/lib/models/UploadedImage';

// Image upload — saves the file into MongoDB and returns a URL that serves it
// back via `/api/images/[id]`.
//
// Why MongoDB: Vercel's serverless filesystem is read-only (writes to
// `public/uploads` throw EROFS), so uploaded images must live in external
// storage. This app already has a MongoDB connection, so we reuse it — no extra
// service or dashboard setup needed.
//
// Note: Vercel rejects request bodies larger than ~4.5 MB. The browser
// compresses images before upload (see lib/upload-image.ts) to stay under this,
// but we also guard here and return a clear message.

// Allow slightly under Vercel's 4.5 MB request-body limit.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const contentType = file.type || 'application/octet-stream';
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JPG, PNG, WEBP, GIF or AVIF image.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `Image is too large (${mb} MB). Please upload an image under 4 MB, or let it compress and try again.`,
        },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${(file.name || 'image').replace(/\s+/g, '-')}`;

    await dbConnect();
    const doc = await UploadedImage.create({
      data: buffer,
      contentType,
      filename,
      size: buffer.length,
    });

    const url = `/api/images/${doc._id}`;
    return NextResponse.json({ url, filename });
  } catch (error: any) {
    const message: string = error?.message || String(error);
    console.error('Upload error:', message, error);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
