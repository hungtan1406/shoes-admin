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

// Add review to product
const addReview = async (req, res) => {
  try {
    const { id } = req.params; // ID sản phẩm
    const { customer, name, rating, comment } = req.body; // Nhận thông tin từ body

    if (!customer || !name || !rating || !comment) {
      return res.status(400).json({
        message: 'All fields are required: customer, name, rating, comment',
      });
    }

    // Tìm sản phẩm theo ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Kiểm tra nếu khách hàng đã đánh giá
    const alreadyReviewed = product.reviews.find(
      (review) => review.customer.toString() === customer
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: 'Product already reviewed by this customer' });
    }

    // Thêm đánh giá mới
    const review = {
      customer,
      name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    // Cập nhật đánh giá trung bình
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res
      .status(500)
      .json({ message: 'Error adding review', error: error.message });
  }
};

// Get reviews of a product
const getReviews = async (req, res) => {
  try {
    const { id } = req.params; // ID sản phẩm

    const product = await Product.findById(id).select('reviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res
      .status(500)
      .json({ message: 'Error fetching reviews', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params; // ID sản phẩm và ID đánh giá

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Lọc bỏ đánh giá cần xóa
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    // Cập nhật đánh giá trung bình
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      (product.reviews.length || 1);

    await product.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res
      .status(500)
      .json({ message: 'Error deleting review', error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find().select('reviews name _id');
    const allReviews = products.flatMap((product) =>
      product.reviews.map((review) => ({
        productId: product._id, // Thêm productId
        productName: product.name,
        ...review.toObject(),
      }))
    );
    res.status(200).json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res
      .status(500)
      .json({ message: 'Error fetching reviews', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  deleteReview,
  getAllReviews,
};
