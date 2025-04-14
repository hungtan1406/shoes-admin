const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  sizes: [
    {
      size: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
