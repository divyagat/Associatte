import mongoose from 'mongoose';

// Standard Connection String (no SRV lookup)
const MONGODB_URI = 'mongodb+srv://pushkargharate7_db_user:xiJLA62jsjF1d2wW@cluster0.wxn2vix.mongodb.net/mydatabase?retryWrites=true&w=majority';

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