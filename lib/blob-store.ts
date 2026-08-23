// lib/blob-store.ts
import fs from 'fs/promises';
import path from 'path';

/**
 * Whether the data layer is backed by a remote blob store (Vercel Blob) rather
 * than the local filesystem. This project uses the committed JSON seed files on
 * disk as the source of truth, so this is `false` unless a blob token is set —
 * but callers (e.g. admin-users) branch on it to decide whether to obfuscate
 * sensitive file names. Kept as a function so a future blob backend can flip it
 * via env without touching every call site.
 */
export function usingBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Reads and parses a JSON file from the project root. Returns `defaultValue`
 * (or null when omitted) if the file doesn't exist or can't be parsed, so
 * callers never have to handle a read failure themselves.
 */
export async function readJson<T>(filePath: string, defaultValue: T): Promise<T>;
export async function readJson<T>(filePath: string): Promise<T | null>;
export async function readJson<T>(filePath: string, defaultValue?: T): Promise<T | null> {
  const fallback = defaultValue ?? null;
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(fileContents) as T;
  } catch (error: any) {
    // If file doesn't exist yet, return the fallback gracefully.
    if (error.code === 'ENOENT') {
      return fallback;
    }
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

/**
 * Writes data to a JSON file, creating directories if they don't exist.
 */
export async function writeJson<T>(filePath: string, data: T): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure the directory exists before writing (e.g., creates 'data/' folder)
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}