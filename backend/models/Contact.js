const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
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
  },
  subject: {
    type: String,
    required: [true, 'Vui lòng chọn chủ đề'],
    enum: ['product-inquiry', 'test-drive', 'purchase', 'service', 'warranty', 'other']
  },
  message: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung tin nhắn'],
    maxlength: [2000, 'Tin nhắn không được quá 2000 ký tự']
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'social', 'showroom'],
    default: 'website'
  },
  customerType: {
    type: String,
    enum: ['new', 'existing', 'potential'],
    default: 'new'
  },
  followUpDate: Date,
  resolvedAt: Date,
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ subject: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ assignedTo: 1 });

// Virtual for status display
contactSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    new: 'Mới',
    in_progress: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for subject display
contactSchema.virtual('subjectDisplay').get(function() {
  const subjectMap = {
    'product-inquiry': 'Tư vấn sản phẩm',
    'test-drive': 'Đăng ký lái thử',
    'purchase': 'Mua xe',
    'service': 'Dịch vụ sau bán hàng',
    'warranty': 'Bảo hành',
    'other': 'Khác'
  };
  return subjectMap[this.subject] || this.subject;
});

// Virtual for priority display
contactSchema.virtual('priorityDisplay').get(function() {
  const priorityMap = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    urgent: 'Khẩn cấp'
  };
  return priorityMap[this.priority] || this.priority;
});

// Virtual for response time (in hours)
contactSchema.virtual('responseTime').get(function() {
  if (this.response && this.response.respondedAt) {
    const diffMs = this.response.respondedAt - this.createdAt;
    return Math.round(diffMs / (1000 * 60 * 60)); // Convert to hours
  }
  return null;
});

// Auto-assign priority based on subject
contactSchema.pre('save', function(next) {
  if (this.isNew) {
    const highPrioritySubjects = ['warranty', 'service'];
    const urgentSubjects = ['purchase'];
    
    if (urgentSubjects.includes(this.subject)) {
      this.priority = 'urgent';
    } else if (highPrioritySubjects.includes(this.subject)) {
      this.priority = 'high';
    }
  }
  next();
});

// Static method to get contacts by status
contactSchema.statics.getByStatus = function(status, options = {}) {
  const { page = 1, limit = 20, assignedTo } = options;
  const query = { status };
  
  if (assignedTo) {
    query.assignedTo = assignedTo;
  }
  
  return this.find(query)
    .populate('assignedTo', 'name email')
    .populate('response.respondedBy', 'name')
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get statistics
contactSchema.statics.getStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          status: '$status',
          subject: '$subject'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.status',
        subjects: {
          $push: {
            subject: '$_id.subject',
            count: '$count'
          }
        },
        total: { $sum: '$count' }
      }
    }
  ]);
};

// Static method to get overdue contacts
contactSchema.statics.getOverdue = function() {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  
  return this.find({
    status: { $in: ['new', 'in_progress'] },
    createdAt: { $lt: twoDaysAgo },
    followUpDate: { $lt: new Date() }
  }).populate('assignedTo', 'name email');
};

module.exports = mongoose.model('Contact', contactSchema);
