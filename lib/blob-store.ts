// lib/blob-store.ts
//
// Persistence layer for JSON data (blogs, properties, projects, site-config,
// admin users). Works identically on ANY host.
//
// Why this exists: the app used to write JSON to the local filesystem, which
// fails on read-only serverless hosts like Vercel (EROFS). A later version used
// Vercel Blob, but that only works on Vercel and needs an extra token. To make
// the app deploy-anywhere, all JSON now persists to MongoDB (the app already has
// a MongoDB connection). Only the DB connection is required — no filesystem
// writes, no host-specific storage service.
//
// Seed data: the committed `data/*.json` files still ship in the build. The first
// read of a key finds nothing in MongoDB and returns the committed file as a
// seed; the first write then persists it to MongoDB, which becomes the source of
// truth from then on. Existing blogs/properties therefore never disappear.

import { promises as fs } from 'fs';
import path from 'path';
import dbConnect from './mongodb';
import DataDoc from './models/DataDoc';

/**
 * Kept for backwards compatibility with callers that branched on Vercel Blob.
 * Storage is now always MongoDB, so this always returns false (no Blob-specific
 * behaviour such as secret-obfuscated pathnames is needed — MongoDB is private).
 */
export function usingBlob(): boolean {
  return false;
}

// ---------- JSON documents (blogs.json, properties.json, …) ----------

/**
 * Read a JSON array/object stored at `key` (e.g. `"data/blogs.json"`).
 * Returns the MongoDB document if present, otherwise the committed local seed
 * file, otherwise `fallback`.
 */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    await dbConnect();
    const doc = await DataDoc.findOne({ key }).lean();
    if (doc && (doc as any).value !== undefined && (doc as any).value !== null) {
      return (doc as any).value as T;
    }
  } catch (error: any) {
    console.error(`❌ Mongo read failed for ${key}:`, error?.message || error);
    // Fall through to the committed seed file on error.
  }

  // First run (nothing in MongoDB yet) or read error → committed seed file.
  try {
    const raw = await fs.readFile(path.join(process.cwd(), key), 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error: any) {
    if (error?.code === 'ENOENT') return fallback;
    console.error(`❌ Local seed read failed for ${key}:`, error?.message || error);
    return fallback;
  }
}

/** Persist a JSON document at `key` to MongoDB (upsert). */
export async function writeJson<T>(key: string, data: T): Promise<void> {
  await dbConnect();
  await DataDoc.findOneAndUpdate(
    { key },
    { key, value: data },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}
