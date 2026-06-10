// Migrates the static blog posts in lib/blog-data.ts into MongoDB.
// Idempotent: upserts by slug, so it is safe to run multiple times.
// Run with:  node --experimental-strip-types --env-file=.env.local scripts/seed-blogs.ts
import mongoose from 'mongoose';
import { BLOG_POSTS } from '../lib/blog-data';
import Blog from '../lib/models/Blog';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Pass --env-file=.env.local');
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to', mongoose.connection.name);

  const posts = Object.values(BLOG_POSTS);
  let created = 0;
  let updated = 0;

  for (const post of posts) {
    // `id` only exists in the static data; the DB uses its own _id.
    const { id, ...data } = post as any;
    const res = await Blog.updateOne(
      { slug: post.slug },
      { $set: data },
      { upsert: true }
    );
    if (res.upsertedCount && res.upsertedCount > 0) created++;
    else updated++;
  }

  console.log(`Seed complete: ${created} created, ${updated} updated, ${posts.length} total.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
