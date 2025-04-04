const Customer = require('../models/Customer');
const Order = require('../models/Order');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone address') // Populate customer details
      .populate('orderItems.product', 'name price'); // Populate product details
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('orderItems.product', 'name price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customer, orderItems, totalAmount } = req.body;

    // Check if customer exists or create a new one
    let existingCustomer = await Customer.findOne({ email: customer.email });
    if (!existingCustomer) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    // Create the order
    const newOrder = new Order({
      customer: existingCustomer._id,
      orderItems,
      totalAmount,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Update the order and populate the customer field
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('customer', 'name email phone address') // Populate customer details
      .populate('orderItems.product', 'name price'); // Populate product details

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

// Get dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalCustomers = await Customer.countDocuments();

    res.status(200).json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics', error });
  }
};

// Get recent orders
const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name')
      .populate('orderItems.product', 'name price');
    res.status(200).json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent orders', error });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getDashboardMetrics,
  getRecentOrders,
};
