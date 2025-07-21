const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Đơn hàng phải có người dùng']
  },
  items: [{
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng tối thiểu là 1']
    },
    selectedColor: {
      type: String,
      required: [true, 'Vui lòng chọn màu xe']
    },
    depositAmount: {
      type: Number,
      required: [true, 'Vui lòng nhập số tiền đặt cọc'],
      min: [0, 'Số tiền đặt cọc không được âm']
    },
    unitPrice: {
      type: Number,
      required: true
    }
  }],
  customerInfo: {
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại']
    },
    address: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ']
    },
    city: {
      type: String,
      required: [true, 'Vui lòng chọn thành phố']
    }
  },
  payment: {
    method: {
      type: String,
      required: [true, 'Vui lòng chọn phương thức thanh toán'],
      enum: ['bank_transfer', 'credit_card', 'cash']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    amount: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    customer: String,
    admin: String
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Tổng tiền không được âm']
  },
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (orderNumber already has unique: true, so no need for separate index)
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    this.orderNumber = `VF${year}${month}${day}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.depositAmount * item.quantity);
    }, 0);
    
    this.payment.amount = this.totalAmount;
  }
  next();
});

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `#${this.orderNumber}`;
});

// Virtual for status display
orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment status display
orderSchema.virtual('paymentStatusDisplay').get(function() {
  const statusMap = {
    pending: 'Chờ thanh toán',
    completed: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền'
  };
  return statusMap[this.payment.status] || this.payment.status;
});

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const query = { user: userId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('items.car', 'name images price')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get revenue statistics
orderSchema.statics.getRevenueStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        'payment.status': 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);
