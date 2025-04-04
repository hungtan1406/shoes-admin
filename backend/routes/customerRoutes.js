const express = require('express');
const {
  getAllCustomers,
  getCustomerById,
  createOrUpdateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

const router = express.Router();

// Get all customers
router.get('/', getAllCustomers);

// Get customer by ID
router.get('/:id', getCustomerById);

// Create or update a customer
router.post('/', createOrUpdateCustomer);

// Delete a customer
router.delete('/:id', deleteCustomer);

module.exports = router;
