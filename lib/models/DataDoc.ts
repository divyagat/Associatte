import mongoose, { Schema, Document, Model } from 'mongoose';

// Generic key/value document store.
//
// Each admin data "file" (blogs, properties, projects, site-config, admin-users)
// is stored as ONE document keyed by its old filename (e.g. "data/blogs.json").
// This replaces the previous filesystem / Vercel Blob storage so the app persists
// data identically on ANY host (Vercel, VPS, Railway, etc.) — it only needs the
// MongoDB connection, which works everywhere.

export interface IDataDoc extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const DataDocSchema = new Schema<IDataDoc>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    minimize: false, // keep empty objects/arrays as stored
  }
);

const DataDoc: Model<IDataDoc> =
  mongoose.models.DataDoc || mongoose.model<IDataDoc>('DataDoc', DataDocSchema);

export default DataDoc;
