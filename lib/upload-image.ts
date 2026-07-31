'use client';

import { upload } from '@vercel/blob/client';

// Uploads an image and returns its public URL.
//
// Production (Vercel Blob connected): the browser uploads the file DIRECTLY to
// Vercel Blob via `upload()`, bypassing Vercel's 4.5 MB serverless request-body
// limit that otherwise makes large photo uploads 500.
//
// Local dev (no Blob token): `upload()` fails because the token route can't mint
// a client token, so we fall back to POSTing the file as multipart/form-data to
// /api/upload, which writes it to public/uploads — exactly the old behaviour.
// Local dev never has a Blob token, so attempting a client-direct upload there
// always fails with a noisy 500 before falling back. Detect localhost and skip
// straight to the multipart route (writes public/uploads). Deployed hosts use
// the direct-to-Blob path.
function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

async function uploadViaServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error(data.error || 'Image upload failed. Please try again.');
  }
  return data.url;
}

export async function uploadImage(file: File): Promise<string> {
  if (isLocalhost()) {
    return uploadViaServer(file);
  }

  try {
    const blob = await upload(file.name.replace(/\s+/g, '-'), file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      multipart: true, // split large files into parts, upload in parallel + retry
      contentType: file.type || undefined,
    });
    return blob.url;
  } catch (directErr) {
    // Fall back to the server multipart route if direct upload is unavailable.
    try {
      return await uploadViaServer(file);
    } catch {
      throw new Error(
        (directErr as any)?.message || 'Image upload failed. Please try again.',
      );
    }
  }
}
