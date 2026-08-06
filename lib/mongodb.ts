import mongoose from 'mongoose';

// Connection string comes from the MONGODB_URI environment variable.
// Set it locally in `.env` and on your host (Vercel/VPS/etc.) env settings.
//
// NOTE: the check lives inside dbConnect(), NOT at module top level. A top-level
// throw would crash this module during import, which makes every route that
// imports it fail to load and return 404. Throwing at call time keeps the module
// loadable and lets callers (e.g. readJson) handle the error gracefully.

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  const RAW_URI = process.env.MONGODB_URI;
  if (!RAW_URI) {
    throw new Error(
      'MONGODB_URI is not set. Add it to your .env file and to your hosting provider\'s environment variables.',
    );
  }

  // Guard against an invalid custom write-concern mode in the URI (a typo like
  // `w=majoritypro`) which makes EVERY write fail with
  // `UnknownReplWriteConcern: No write concern mode named 'majoritypro' found`.
  // We rewrite any non-numeric `w=` value to the standard `majority`.
  const MONGODB_URI = RAW_URI.replace(/([?&]w=)(?!majority(?:&|$))([A-Za-z][\w-]*)/gi, '$1majority');
  if (MONGODB_URI !== RAW_URI) {
    console.warn('⚠️ MONGODB_URI had a non-standard write concern; using w=majority. Fix the URI to remove this warning.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Force a valid write concern regardless of what the URI supplies.
      writeConcern: { w: 'majority' as const },
    };

    console.log('🚀 Connecting to MongoDB Atlas...');
    console.log('📍 Using Standard Connection String (no SRV lookup)');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Atlas Connected Successfully!');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB Connection Failed:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;  // ✅ Fixed - removed the 's'
    console.error('❌ MongoDB Error:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;