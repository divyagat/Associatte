import mongoose, { Schema, Document, Model } from 'mongoose';

// A key/value store for the app's JSON "files" (data/*.json).
//
// Why: Vercel's serverless filesystem is read-only, so `fs.writeFile` to
// `data/*.json` throws EROFS and every admin save fails with a 400. This app
// already has a MongoDB connection (see lib/mongodb.ts, used by image uploads),
// so we persist each JSON document here instead — keyed by its file path (e.g.
// `data/site-config.json`). Reads fall back to the committed seed file on disk
// the first time a key isn't in the DB yet (see lib/blob-store.ts).

export interface IJsonDoc extends Document {
  key: string;
  // Arbitrary JSON payload (an object or array).
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const JsonDocSchema = new Schema<IJsonDoc>(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    minimize: false, // keep empty objects/arrays as-is
  }
);

const JsonDoc: Model<IJsonDoc> =
  mongoose.models.JsonDoc || mongoose.model<IJsonDoc>('JsonDoc', JsonDocSchema);

export default JsonDoc;
