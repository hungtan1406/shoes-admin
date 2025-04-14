const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  deleteReview,
  getAllReviews,
} = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
// const { protectCustomer } = require('../middleware/authMiddleware'); // Middleware xác thực khách hàng

const router = express.Router();

// Get all products
router.get('/get-all', getAllProducts);

// Get product by ID
router.get('/get-product/:id', getProductById);

// Add a new product
router.post('/add', upload.array('images', 5), createProduct);

// Update product by ID
router.put('/update/:id', upload.array('images', 5), updateProduct);

// Delete product by ID
router.delete('/delete/:id', deleteProduct);

// Thêm đánh giá
router.post('/:id/reviews', addReview);

// Lấy danh sách đánh giá
router.get('/:id/reviews', getReviews);

// Xóa đánh giá
router.delete('/:id/reviews/:reviewId', deleteReview);

// Lấy tất cả đánh giá từ tất cả sản phẩm
router.get('/reviews', getAllReviews);

module.exports = router;
