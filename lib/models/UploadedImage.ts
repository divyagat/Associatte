import mongoose, { Schema, Document, Model } from 'mongoose';

// Stores uploaded images as binary data inside MongoDB.
//
// Why: Vercel's serverless filesystem is read-only, so images can't be written
// to `public/uploads`. This app already has a MongoDB connection, so uploaded
// images are stored here and served back via `/api/images/[id]`.

export interface IUploadedImage extends Document {
  data: Buffer;
  contentType: string;
  filename: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const UploadedImageSchema = new Schema<IUploadedImage>(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const UploadedImage: Model<IUploadedImage> =
  mongoose.models.UploadedImage ||
  mongoose.model<IUploadedImage>('UploadedImage', UploadedImageSchema);

export default UploadedImage;
