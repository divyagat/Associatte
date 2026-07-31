// lib/blob-store.ts
//
// Persistence layer that works BOTH locally and on Vercel.
//
// Why this exists: the app used to write JSON data (`data/*.json`) and uploaded
// images (`public/uploads/*`) directly to the local filesystem. That works on a
// dev machine but FAILS on Vercel, whose serverless filesystem is read-only
// (only `/tmp` is writable, and it's wiped between requests). So on Vercel blog
// saves and image uploads silently threw.
//
// Fix: when a Vercel Blob token is present (`BLOB_READ_WRITE_TOKEN`, injected
// automatically once you create a Blob store in the Vercel dashboard), reads and
// writes go to Vercel Blob — durable, shared across all serverless invocations.
// When the token is absent (local `next dev` with no `.env.local`), we fall back
// to the exact filesystem behaviour as before, so local development is unchanged.
//
// Seed data: the committed `data/*.json` files still ship in the build. On Vercel
// the first read of a key finds nothing in Blob and returns the committed file as
// a seed; the first write then persists the whole array to Blob, which becomes
// the source of truth from then on. Existing blogs/properties therefore never
// disappear.

import { promises as fs } from 'fs';
import path from 'path';

const HAS_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

/** True when running against Vercel Blob (production), false for local FS. */
export function usingBlob(): boolean {
  return HAS_BLOB;
}

// ---------- JSON documents (blogs.json, properties.json, …) ----------

/**
 * Read a JSON array/object stored at `key` (e.g. `"data/blogs.json"`).
 * On Blob: returns the stored blob if present, otherwise the committed local
 * seed file, otherwise `fallback`. On local FS: reads the file, or `fallback`.
 */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (HAS_BLOB) {
    try {
      const { list } = await import('@vercel/blob');
      const { blobs } = await list({ prefix: key });
      const found = blobs.find((b) => b.pathname === key);
      if (found) {
        // no-store + a short cache TTL on write keeps admin edits fresh.
        const res = await fetch(found.url, { cache: 'no-store' });
        if (res.ok) return (await res.json()) as T;
      }
    } catch (error: any) {
      console.error(`❌ Blob read failed for ${key}:`, error?.message || error);
    }
    // Fall through to the committed seed file on first run / on read error.
  }

  try {
    const raw = await fs.readFile(path.join(process.cwd(), key), 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error: any) {
    if (error?.code === 'ENOENT') return fallback;
    console.error(`❌ Local read failed for ${key}:`, error?.message || error);
    return fallback;
  }
}

/** Persist a JSON document at `key`. Blob in production, filesystem locally. */
export async function writeJson<T>(key: string, data: T): Promise<void> {
  const body = JSON.stringify(data, null, 2);

  if (HAS_BLOB) {
    const { put } = await import('@vercel/blob');
    await put(key, body, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false, // stable pathname so we can read it back
      allowOverwrite: true,
      cacheControlMaxAge: 0, // minimise CDN caching for fast-changing data
    });
    return;
  }

  const filePath = path.join(process.cwd(), key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf-8');
}

// ---------- Binary uploads (images) ----------

/**
 * Store an uploaded file and return its public URL.
 * On Blob: uploads to `uploads/<name>` and returns the absolute Blob URL.
 * On local FS: writes to `public/uploads/<name>` and returns `/uploads/<name>`.
 */
export async function uploadFile(
  filename: string,
  data: Buffer,
  contentType: string,
): Promise<string> {
  if (HAS_BLOB) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`uploads/${filename}`, data, {
      access: 'public',
      contentType,
      addRandomSuffix: true, // avoid collisions; Blob returns the final URL
    });
    return blob.url;
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), data);
  return `/uploads/${filename}`;
}
