import mongoose, { Schema, Document, Model } from 'mongoose';

// A plain, JSON-serializable blog record — this is what's actually persisted
// (see lib/data-store.ts, which reads/writes data/blogs.json directly and
// never touches the Mongoose model below), so `_id`/`createdAt`/`updatedAt`
// are plain strings rather than the ObjectId/Date a live Document would have.
export interface IBlog {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  image2?: string;
  category: string;
  city: string;
  location: string;
  date: string;
  readTime: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  courtesy?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  relatedSlugs: string[];
  recentPostSlugs?: string[];
  overlayText?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BlogSchema = new Schema<IBlog & Document>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    image2: String,
    category: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    tags: [{ type: String, index: true }],
    author: {
      name: { type: String, required: true },
      role: { type: String, required: true },
      avatar: { type: String, required: true },
      bio: { type: String, required: true },
    },
    courtesy: String,
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }],
    relatedSlugs: [{ type: String }],
    recentPostSlugs: [{ type: String }],
    overlayText: String,
  },
  {
    timestamps: true,
  }
);

const Blog: Model<IBlog & Document> = mongoose.models.Blog || mongoose.model<IBlog & Document>('Blog', BlogSchema);

export default Blog;