import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/blob-store';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    // Persists to Vercel Blob on Vercel (durable) or public/uploads locally.
    const url = await uploadFile(uniqueName, buffer, file.type || 'application/octet-stream');

    return NextResponse.json({ url, filename: uniqueName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
