const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }, // Total stock
  sizes: [
    {
      size: { type: Number, required: true }, // Shoe size
      quantity: { type: Number, required: true }, // Quantity for the size
    },
  ],
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // Array of image paths
});

module.exports = mongoose.model('Product', productSchema);
