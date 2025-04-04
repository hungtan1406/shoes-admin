const Customer = require('../models/Customer');

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

// Create or update a customer
const createOrUpdateCustomer = async (req, res) => {
  try {
    const { email, name, phone, address } = req.body;

    let customer = await Customer.findOne({ email });
    if (customer) {
      // Update existing customer
      customer.name = name;
      customer.phone = phone;
      customer.address = address;
      await customer.save();
    } else {
      // Create new customer
      customer = new Customer({ email, name, phone, address });
      await customer.save();
    }

    res.status(200).json({ message: 'Customer saved successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error saving customer', error });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createOrUpdateCustomer,
  deleteCustomer,
};
