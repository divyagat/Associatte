import * as dns from 'dns';
// Force Node.js to use reliable public DNS servers for SRV lookups
// This fixes the "querySrv ECONNREFUSED" error in many Node.js environments
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

const resolveSrv = (hostname: string) =>
  new Promise<dns.SrvRecord[]>((resolve, reject) =>
    dns.resolveSrv(`_mongodb._tcp.${hostname}`, (err, records) => (err ? reject(err) : resolve(records))),
  );

const resolveTxt = (hostname: string) =>
  new Promise<string[][]>((resolve, reject) =>
    dns.resolveTxt(hostname, (err, records) => (err ? reject(err) : resolve(records))),
  );

/**
 * Atlas SRV lookups (`_mongodb._tcp.<host>`) intermittently get a transient
 * ECONNREFUSED in this environment even though plain A-record DNS is fine.
 * The MongoDB driver only tries the SRV lookup once per connection attempt,
 * so a single blip fails the whole connect. Resolving it ourselves — with a
 * cheap, fast retry — and connecting via the resulting host list instead of
 * `mongodb+srv://` sidesteps the driver's one-shot SRV resolution entirely.
 * Falls back to the original SRV URI if resolution can't succeed at all.
 */
async function toDirectConnectionUri(srvUri: string): Promise<string> {
  const match = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]*)(\?.*)?$/);
  if (!match) return srvUri;
  const [, user, pass, host, db, query] = match;

  let srvRecords: dns.SrvRecord[] | undefined;
  let txtRecords: string[][] | undefined;
  for (let attempt = 0; attempt < 3 && !srvRecords; attempt++) {
    try {
      [srvRecords, txtRecords] = await Promise.all([resolveSrv(host), resolveTxt(host).catch(() => [])]);
    } catch {
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  if (!srvRecords) return srvUri;

  const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');
  const params = new URLSearchParams(query ? query.slice(1) : '');
  for (const line of (txtRecords || []).map((r) => r.join(''))) {
    for (const pair of line.split('&')) {
      const [key, value] = pair.split('=');
      if (key && value && !params.has(key)) params.set(key, value);
    }
  }
  if (!params.has('tls') && !params.has('ssl')) params.set('tls', 'true');

  return `mongodb://${user}:${pass}@${hosts}/${db}?${params.toString()}`;
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

  const MONGODB_URI = RAW_URI.replace(/([?&]w=)(?!majority(?:&|$))([A-Za-z][\w-]*)/gi, '$1majority');
  if (MONGODB_URI !== RAW_URI) {
    console.warn('⚠️ MONGODB_URI had a non-standard write concern; using w=majority. Fix the URI to remove this warning.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      writeConcern: { w: 'majority' as const },
      // Windows resolves Atlas SRV hosts to IPv6 first, which many networks
      // can't route to; it then stalls for the full serverSelectionTimeoutMS
      // before falling back to IPv4. Forcing IPv4 and shortening the timeout
      // turns a ~30s hang into an immediate, fast connection.
      family: 4 as const,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log('🚀 Connecting to MongoDB...');

    const connectWithRetry = async (attemptsLeft: number): Promise<typeof mongoose> => {
      try {
        const uri = MONGODB_URI.startsWith('mongodb+srv://')
          ? await toDirectConnectionUri(MONGODB_URI)
          : MONGODB_URI;
        return await mongoose.connect(uri, opts);
      } catch (error) {
        if (attemptsLeft > 0) {
          console.warn(`⚠️ MongoDB connection attempt failed, retrying... (${attemptsLeft} left)`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return connectWithRetry(attemptsLeft - 1);
        }
        throw error;
      }
    };

    cached.promise = connectWithRetry(2).then((mongoose) => {
      console.log('✅ MongoDB Connected Successfully!');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB Connection Failed:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Error:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;