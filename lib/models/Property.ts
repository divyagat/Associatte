import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProperty extends Document {
  slug: string;
  name: string;
  location: 'pune' | 'mumbai' | 'kdmc';
  price: string;
  image: string;
  masterPlan?: string;
  locationMap?: string;
  fullLocation: {
    area: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
  };
  priceDetails: {
    range: string;
    perSqft: string;
    configurations: Array<{
      type: string;
      area: string;
      price: string;
      description: string;
    }>;
  };
  developer: {
    name: string;
    established: string;
    projectsCount: number;
    description: string;
  };
  about: string;
  amenities: string[];
  floorPlans: Array<{
    type: string;
    area: string;
    image: string;
  }>;
  possessionDate: string;
  reraNumber: string;
  gallery: string[];
  mapCoords: {
    lat: number;
    lng: number;
  };
  nearbyPlaces: Array<{
    type: string;
    name: string;
    distance: string;
  }>;
  emi: {
    startingFrom: string;
    downPayment: string;
    interestRate: string;
    tenure: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    location: { 
      type: String, 
      required: true, 
      enum: ['pune', 'mumbai', 'kdmc'],
      index: true 
    },
    price: { type: String, required: true },
    image: { type: String, required: true },
    masterPlan: String,
    locationMap: String,
    fullLocation: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String, required: true },
    },
    priceDetails: {
      range: { type: String, required: true },
      perSqft: { type: String, required: true },
      configurations: [{
        type: { type: String, required: true },
        area: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
      }],
    },
    developer: {
      name: { type: String, required: true, index: true },
      established: { type: String, required: true },
      projectsCount: { type: Number, required: true },
      description: { type: String, required: true },
    },
    about: { type: String, required: true },
    amenities: [{ type: String }],
    floorPlans: [{
      type: { type: String, required: true },
      area: { type: String, required: true },
      image: { type: String, required: true },
    }],
    possessionDate: { type: String, required: true },
    reraNumber: { type: String, required: true },
    gallery: [{ type: String }],
    mapCoords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    nearbyPlaces: [{
      type: { type: String, required: true },
      name: { type: String, required: true },
      distance: { type: String, required: true },
    }],
    emi: {
      startingFrom: { type: String, required: true },
      downPayment: { type: String, required: true },
      interestRate: { type: String, required: true },
      tenure: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;