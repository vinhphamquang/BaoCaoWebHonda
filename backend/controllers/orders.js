const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Car = require('../models/Car');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      query['payment.status'] = req.query.paymentStatus;
    }

    // Execute query
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.car', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Order.countDocuments(query);

    // Pagination result
    const pagination = {};

    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.car', 'name images price specifications');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập đơn hàng này'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    // Verify cars exist and get their prices
    const carIds = req.body.items.map(item => item.car);
    const cars = await Car.find({ _id: { $in: carIds }, isActive: true });

    if (cars.length !== carIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Một hoặc nhiều xe không tồn tại'
      });
    }

    // Update items with actual car prices
    const updatedItems = req.body.items.map(item => {
      const car = cars.find(c => c._id.toString() === item.car);
      return {
        ...item,
        unitPrice: car.price
      };
    });

    // Create order
    const orderData = {
      ...req.body,
      user: req.user.id,
      items: updatedItems
    };

    const order = await Order.create(orderData);

    // Populate the created order
    await order.populate('user', 'name email phone');
    await order.populate('items.car', 'name images price');

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email phone')
     .populate('items.car', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật đơn hàng thành công',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa đơn hàng thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const orders = await Order.getByUser(req.user.id, { page, limit, status: req.query.status });
    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')
     .populate('items.car', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/revenue
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const stats = await Order.getRevenueStats(startDate, endDate);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0
      }
    });
  } catch (error) {
    next(error);
  }
};
