const Product = require('../models/Product');
const upload = require('../middleware/uploadMiddleware'); // Import middleware for image upload

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Format price to VNĐ
    const formattedProducts = products.map((product) => ({
      ...product._doc,
      price: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(product.price),
    }));

    res.status(200).json({ products: formattedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      price,
      sizeQuantities, // Object with size as key and quantity as value
      brand,
      category,
      description,
    } = req.body;

    // Process images
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Convert sizeQuantities into an array of { size, quantity }
    const sizes = Object.entries(JSON.parse(sizeQuantities)).map(
      ([size, quantity]) => ({
        size: parseInt(size, 10),
        quantity: parseInt(quantity, 10),
      })
    );

    // Calculate total stock
    const totalStock = sizes.reduce((sum, item) => sum + item.quantity, 0);

    // Create new product
    const newProduct = new Product({
      name,
      sku,
      price,
      stock: totalStock,
      sizes,
      brand,
      category,
      description,
      images,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res
      .status(500)
      .json({ message: 'Error adding product', error: error.message });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, price, category, brand, stock, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        sku,
        price,
        category,
        brand,
        stock,
        description,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(500)
      .json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res
      .status(500)
      .json({ message: 'Error deleting product', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
