const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');

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

module.exports = router;
