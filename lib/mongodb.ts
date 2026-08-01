import mongoose from 'mongoose';

// Connection string comes from the MONGODB_URI environment variable.
// Set it locally in `.env` and on your host (Vercel/VPS/etc.) env settings.
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI is not set. Add it to your .env file and to your hosting provider\'s environment variables.',
  );
}

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

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
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