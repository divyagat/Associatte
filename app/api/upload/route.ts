import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { uploadFile, usingBlob } from '@/lib/blob-store';

// Vercel serverless functions reject request bodies larger than ~4.5 MB. That is
// why a small blog JSON save succeeds but a real photo upload 500s. To avoid the
// limit entirely, the browser uploads the file DIRECTLY to Vercel Blob using
// `@vercel/blob/client` — this route only issues the short-lived upload token
// (tiny JSON), so the big file never passes through the function.
//
// Locally there is no Blob token, so the client helper falls back to POSTing the
// file here as multipart/form-data and we write it to `public/uploads` as before.

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB, safely under Vercel's limit (fallback path only)

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';

  // --- Client-direct upload token flow (production, any file size) ---
  if (contentType.includes('application/json')) {
    try {
      const body = (await request.json()) as HandleUploadBody;
      const jsonResponse = await handleUpload({
        request,
        body,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
          addRandomSuffix: true,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB cap for direct uploads
        }),
        // No-op: the client already receives the final blob URL from upload().
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(jsonResponse);
    } catch (error: any) {
      const message: string = error?.message || String(error);
      console.error('Client upload token error:', message, error);
      return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
    }
  }

  // --- Legacy multipart fallback (local dev without a Blob token) ---
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `Image is too large (${mb} MB). Please upload an image under 4 MB, or compress it first.`,
        },
        { status: 413 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const url = await uploadFile(uniqueName, buffer, file.type || 'application/octet-stream');

    return NextResponse.json({ url, filename: uniqueName });
  } catch (error: any) {
    const message: string = error?.message || String(error);
    console.error('Upload error:', message, error);

    const isReadOnlyFs =
      !usingBlob() && (error?.code === 'EROFS' || /read-only|EROFS/i.test(message));
    if (isReadOnlyFs) {
      return NextResponse.json(
        {
          error:
            'Storage is not configured for production. Create a Vercel Blob store and add the BLOB_READ_WRITE_TOKEN environment variable, then redeploy.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
