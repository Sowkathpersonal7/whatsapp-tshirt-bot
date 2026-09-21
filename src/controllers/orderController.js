const Order = require('../models/Order');

/**
 * List orders with optional status or customer filters
 */
async function getOrders(req, res) {
  try {
    const { status, phone } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status.toUpperCase();
    if (phone) filter.customerPhone = phone;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('customerId', 'name phone preferredLanguage');

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get order details by orderId or Mongo ID
 */
async function getOrderDetails(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    }).populate('customerId paymentDetails');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Update order status (Admin fulfillment)
 */
async function updateOrderStatus(req, res) {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  getOrders,
  getOrderDetails,
  updateOrderStatus,
};
