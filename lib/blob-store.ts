// lib/blob-store.ts
import fs from 'fs/promises';
import path from 'path';

/**
 * Persistence for the app's JSON "files" (data/*.json).
 *
 * Two backends:
 *   • MongoDB (production) — when MONGODB_URI is set, each JSON document is
 *     stored in the `jsondocs` collection keyed by its file path. This is
 *     required on Vercel, whose serverless filesystem is READ-ONLY: writing to
 *     `data/*.json` there throws `EROFS: read-only file system`, which made
 *     every admin save fail with a 400. (Image uploads already use MongoDB for
 *     the same reason — see app/api/upload/route.ts.)
 *   • Local filesystem (dev) — when MONGODB_URI is not set, we read/write the
 *     committed JSON seed files under the project root, as before.
 *
 * On the first read of a key that isn't in MongoDB yet, we fall back to the
 * committed seed file on disk (reads are allowed even on Vercel), so existing
 * seed data still appears until the first write migrates it into the DB.
 */

function usingMongo(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

/**
 * Whether the data layer is backed by a remote store rather than the local
 * filesystem. Callers (e.g. admin-users) branch on it to decide whether to
 * obfuscate sensitive file names.
 */
export function usingBlob(): boolean {
  return usingMongo() || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// ==================== FILESYSTEM BACKEND ====================
async function readFileJson<T>(filePath: string, fallback: T | null): Promise<T | null> {
  try {
    // turbopackIgnore: this reads/writes a plain JSON seed file — it's never a
  // require()/import() target, so tracing it as one only pulls the whole
  // project into this route's bundle for no reason.
  const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
    const fileContents = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(fileContents) as T;
  } catch (error) {
    // If the file doesn't exist yet, return the fallback gracefully.
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return fallback;
    }
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

async function writeFileJson<T>(filePath: string, data: T): Promise<void> {
  // turbopackIgnore: this reads/writes a plain JSON seed file — it's never a
  // require()/import() target, so tracing it as one only pulls the whole
  // project into this route's bundle for no reason.
  const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  // Ensure the directory exists before writing (e.g., creates 'data/' folder).
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
}

// ==================== MONGODB BACKEND ====================
// Loaded lazily so local dev (no MONGODB_URI) never pulls in mongoose here.
async function getMongoDeps() {
  const [{ default: dbConnect }, { default: JsonDoc }] = await Promise.all([
    import('./mongodb'),
    import('./models/JsonDoc'),
  ]);
  await dbConnect();
  return { JsonDoc };
}

async function readMongoJson<T>(filePath: string, fallback: T | null): Promise<T | null> {
  const { JsonDoc } = await getMongoDeps();
  const doc = await JsonDoc.findOne({ key: filePath }).lean<{ data: T } | null>();
  if (doc && doc.data !== undefined && doc.data !== null) {
    return doc.data as T;
  }
  // Not in the DB yet — fall back to the committed seed file on disk so existing
  // seed data still shows up until the first write migrates it into MongoDB.
  return readFileJson<T>(filePath, fallback);
}

async function writeMongoJson<T>(filePath: string, data: T): Promise<void> {
  const { JsonDoc } = await getMongoDeps();
  await JsonDoc.findOneAndUpdate(
    { key: filePath },
    { $set: { data } },
    { upsert: true, new: true },
  );
}

// ==================== PUBLIC API ====================
/**
 * Reads and parses a JSON document. Returns `defaultValue` (or null when
 * omitted) if it doesn't exist or can't be read, so callers never have to
 * handle a read failure themselves.
 */
export async function readJson<T>(filePath: string, defaultValue: T): Promise<T>;
export async function readJson<T>(filePath: string): Promise<T | null>;
export async function readJson<T>(filePath: string, defaultValue?: T): Promise<T | null> {
  const fallback = defaultValue ?? null;
  if (usingMongo()) {
    try {
      return await readMongoJson<T>(filePath, fallback);
    } catch (error) {
      console.error(`Error reading ${filePath} from MongoDB:`, error);
      // Last-ditch fallback to the on-disk seed so reads degrade gracefully.
      return readFileJson<T>(filePath, fallback);
    }
  }
  return readFileJson<T>(filePath, fallback);
}

/**
 * Writes a JSON document, creating the backing store as needed.
 */
export async function writeJson<T>(filePath: string, data: T): Promise<void> {
  if (usingMongo()) {
    try {
      await writeMongoJson(filePath, data);
      return;
    } catch (error) {
      // Mongo write failed (e.g. bad-auth / cluster unreachable). Degrade to a
      // local filesystem write so dev/self-hosted setups keep working. On a
      // read-only host (Vercel) this fs write throws EROFS, so we rethrow the
      // ORIGINAL Mongo error to surface the real cause instead of masking it.
      console.error(`Error writing ${filePath} to MongoDB:`, error);
      try {
        await writeFileJson(filePath, data);
        console.warn(`⚠️ Wrote ${filePath} to local filesystem as a fallback (MongoDB unavailable).`);
        return;
      } catch {
        throw error;
      }
    }
  }
  try {
    await writeFileJson(filePath, data);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}
