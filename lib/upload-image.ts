'use client';

// Uploads an image and returns its public URL.
//
// The file is POSTed as multipart/form-data to /api/upload, which stores it in
// MongoDB and returns a `/api/images/<id>` URL that works both locally and on
// Vercel (Vercel's filesystem is read-only, so images can't be written to disk).
//
// Vercel rejects request bodies larger than ~4.5 MB, so before uploading we
// compress/resize large images in the browser to stay comfortably under that.

const TARGET_MAX_BYTES = 3.5 * 1024 * 1024; // aim under Vercel's ~4.5 MB limit
const MAX_DIMENSION = 1920; // px — plenty for web display

// Types the browser canvas can re-encode. GIFs are left untouched to preserve
// animation (they're usually small anyway).
const COMPRESSIBLE = ['image/jpeg', 'image/png', 'image/webp'];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read the selected image.'));
    };
    img.src = url;
  });
}

async function compressImage(file: File): Promise<File> {
  // Small, already-fine files and GIFs skip compression.
  if (file.size <= TARGET_MAX_BYTES || !COMPRESSIBLE.includes(file.type)) {
    return file;
  }

  const img = await loadImage(file);

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file; // fall back to the original if canvas is unavailable
  ctx.drawImage(img, 0, 0, width, height);

  // Step the JPEG quality down until the result is under the target size.
  for (const quality of [0.85, 0.75, 0.65, 0.55, 0.45]) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    );
    if (blob && blob.size <= TARGET_MAX_BYTES) {
      const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
      return new File([blob], name, { type: 'image/jpeg' });
    }
    if (blob && quality === 0.45) {
      // Best effort at lowest quality; return it even if slightly large.
      const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
      return new File([blob], name, { type: 'image/jpeg' });
    }
  }

  return file;
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file).catch(() => file);

  const formData = new FormData();
  formData.append('file', compressed);

  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.url) {
    throw new Error(data.error || 'Image upload failed. Please try again.');
  }
  return data.url;
}
