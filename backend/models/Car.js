const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên xe'],
    trim: true,
    maxlength: [100, 'Tên xe không được quá 100 ký tự']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  type: {
    type: String,
    required: [true, 'Vui lòng chọn loại xe'],
    enum: ['sedan', 'suv', 'electric'],
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá xe'],
    min: [0, 'Giá xe không được âm']
  },
  year: {
    type: Number,
    required: [true, 'Vui lòng nhập năm sản xuất'],
    min: [2020, 'Năm sản xuất không hợp lệ'],
    max: [new Date().getFullYear() + 1, 'Năm sản xuất không hợp lệ']
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả'],
    maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  specifications: {
    engine: {
      type: String,
      required: [true, 'Vui lòng nhập thông tin động cơ']
    },
    power: {
      type: String,
      required: [true, 'Vui lòng nhập công suất']
    },
    transmission: {
      type: String,
      required: [true, 'Vui lòng nhập loại hộp số']
    },
    fuelType: {
      type: String,
      required: [true, 'Vui lòng nhập loại nhiên liệu']
    },
    seating: {
      type: Number,
      required: [true, 'Vui lòng nhập số chỗ ngồi'],
      min: [2, 'Số chỗ ngồi tối thiểu là 2'],
      max: [9, 'Số chỗ ngồi tối đa là 9']
    },
    dimensions: {
      length: String,
      width: String,
      height: String,
      wheelbase: String,
      groundClearance: String
    },
    capacity: {
      trunk: String,
      fuelTank: String
    },
    performance: {
      topSpeed: String,
      acceleration: String
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  }],
  isElectric: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Số lượng tồn kho không được âm']
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, 'Số lượng đã bán không được âm']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Đánh giá tối thiểu là 0'],
      max: [5, 'Đánh giá tối đa là 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (slug already has unique: true, so no need for separate index)
carSchema.index({ name: 'text', description: 'text' });
carSchema.index({ type: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: -1 });
carSchema.index({ isFeatured: -1 });
carSchema.index({ isActive: 1 });

// Virtual for primary image
carSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for orders count
carSchema.virtual('ordersCount', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'items.car',
  count: true
});

// Create slug before saving
carSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Static method to get featured cars
carSchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true, isActive: true }).sort({ createdAt: -1 });
};

// Static method to search cars
carSchema.statics.searchCars = function(query, filters = {}) {
  const searchQuery = { isActive: true, ...filters };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Car', carSchema);
