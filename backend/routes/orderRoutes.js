const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getDashboardMetrics,
  getRecentOrders,
} = require('../controllers/orderController');

const router = express.Router();

// Define specific routes first
router.get('/dashboard/metrics', getDashboardMetrics);
router.get('/recent', getRecentOrders);

// Define general routes after specific ones
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
