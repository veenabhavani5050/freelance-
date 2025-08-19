// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    deliveryTime: { type: Number, required: true }, // in days
    tags: [{ type: String }],
    available: { type: Boolean, default: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
