import mongoose from 'mongoose';

// Standard Connection String (no SRV lookup)
const MONGODB_URI = 'mongodb://divyagate543_db_user:Associatte2024@ac-xxxxx-shard-00-00.nm1yl8x.mongodb.net:27017,ac-xxxxx-shard-00-01.nm1yl8x.mongodb.net:27017,ac-xxxxx-shard-00-02.nm1yl8x.mongodb.net:27017/associatte?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority';

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