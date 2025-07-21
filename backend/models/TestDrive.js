const mongoose = require('mongoose');

const testDriveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Cho phép khách hàng chưa đăng ký
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Vui lòng chọn xe muốn lái thử']
  },
  customerInfo: {
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
      maxlength: [100, 'Họ tên không được quá 100 ký tự']
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Vui lòng nhập email hợp lệ'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    }
  },
  schedule: {
    preferredDate: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày mong muốn'],
      validate: {
        validator: function(date) {
          return date > new Date();
        },
        message: 'Ngày lái thử phải là ngày trong tương lai'
      }
    },
    preferredTime: {
      type: String,
      required: [true, 'Vui lòng chọn giờ mong muốn'],
      enum: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    },
    confirmedDate: Date,
    confirmedTime: String
  },
  location: {
    type: String,
    required: [true, 'Vui lòng chọn địa điểm lái thử'],
    enum: ['hanoi', 'hcm', 'danang', 'haiphong', 'cantho']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [500, 'Ghi chú không được quá 500 ký tự']
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Ghi chú admin không được quá 1000 ký tự']
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: {
    rating: {
      type: Number,
      min: [1, 'Đánh giá tối thiểu là 1'],
      max: [5, 'Đánh giá tối đa là 5']
    },
    comment: {
      type: String,
      maxlength: [1000, 'Nhận xét không được quá 1000 ký tự']
    },
    submittedAt: Date
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
testDriveSchema.index({ user: 1 });
testDriveSchema.index({ car: 1 });
testDriveSchema.index({ status: 1 });
testDriveSchema.index({ 'schedule.preferredDate': 1 });
testDriveSchema.index({ location: 1 });
testDriveSchema.index({ createdAt: -1 });
testDriveSchema.index({ 'customerInfo.email': 1 });
testDriveSchema.index({ 'customerInfo.phone': 1 });

// Virtual for status display
testDriveSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    no_show: 'Không đến'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for location display
testDriveSchema.virtual('locationDisplay').get(function() {
  const locationMap = {
    hanoi: 'Showroom Hà Nội - Long Biên',
    hcm: 'Showroom TP.HCM - Quận 1',
    danang: 'Showroom Đà Nẵng - Hải Châu',
    haiphong: 'Showroom Hải Phòng - Lê Chân',
    cantho: 'Showroom Cần Thơ - Ninh Kiều'
  };
  return locationMap[this.location] || this.location;
});

// Virtual for formatted schedule
testDriveSchema.virtual('formattedSchedule').get(function() {
  if (this.schedule.confirmedDate && this.schedule.confirmedTime) {
    const date = new Date(this.schedule.confirmedDate).toLocaleDateString('vi-VN');
    return `${date} lúc ${this.schedule.confirmedTime}`;
  } else if (this.schedule.preferredDate && this.schedule.preferredTime) {
    const date = new Date(this.schedule.preferredDate).toLocaleDateString('vi-VN');
    return `${date} lúc ${this.schedule.preferredTime} (chờ xác nhận)`;
  }
  return 'Chưa xác định';
});

// Check for scheduling conflicts
testDriveSchema.statics.checkConflict = function(date, time, location, excludeId = null) {
  const query = {
    'schedule.confirmedDate': date,
    'schedule.confirmedTime': time,
    location: location,
    status: { $in: ['confirmed', 'pending'] }
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  return this.findOne(query);
};

// Get available time slots for a date and location
testDriveSchema.statics.getAvailableSlots = async function(date, location) {
  const allSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  
  const bookedSlots = await this.find({
    'schedule.confirmedDate': date,
    location: location,
    status: { $in: ['confirmed', 'pending'] }
  }).distinct('schedule.confirmedTime');
  
  return allSlots.filter(slot => !bookedSlots.includes(slot));
};

// Static method to get test drives by user
testDriveSchema.statics.getByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const query = { user: userId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('car', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get statistics
testDriveSchema.statics.getStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('TestDrive', testDriveSchema);
