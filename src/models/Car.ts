import mongoose, { Schema, Document } from 'mongoose';
import { Car } from '@/types';

export interface CarDocument extends Omit<Car, '_id'>, Document {}

const CarSchema = new Schema<CarDocument>({
  name: {
    type: String,
    required: [true, 'Tên xe là bắt buộc'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model xe là bắt buộc'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Năm sản xuất là bắt buộc'],
    min: [1990, 'Năm sản xuất phải từ 1990 trở lên'],
    max: [new Date().getFullYear() + 1, 'Năm sản xuất không hợp lệ'],
  },
  price: {
    type: Number,
    required: [true, 'Giá xe là bắt buộc'],
    min: [0, 'Giá xe phải lớn hơn 0'],
  },
  color: {
    type: String,
    required: [true, 'Màu sắc là bắt buộc'],
    trim: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  specifications: {
    engine: {
      type: String,
      required: [true, 'Thông tin động cơ là bắt buộc'],
    },
    transmission: {
      type: String,
      required: [true, 'Thông tin hộp số là bắt buộc'],
    },
    fuelType: {
      type: String,
      required: [true, 'Loại nhiên liệu là bắt buộc'],
    },
    seating: {
      type: Number,
      required: [true, 'Số chỗ ngồi là bắt buộc'],
      min: [2, 'Số chỗ ngồi tối thiểu là 2'],
      max: [8, 'Số chỗ ngồi tối đa là 8'],
    },
    mileage: {
      type: String,
      required: [true, 'Mức tiêu thụ nhiên liệu là bắt buộc'],
    },
    safety: [{
      type: String,
    }],
    features: [{
      type: String,
    }],
  },
  description: {
    type: String,
    required: [true, 'Mô tả xe là bắt buộc'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Loại xe là bắt buộc'],
    enum: ['sedan', 'suv', 'hatchback', 'coupe'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Tạo các index tối ưu cho MongoDB Atlas
// Compound text index cho tìm kiếm toàn văn
CarSchema.index({ 
  name: 'text', 
  model: 'text', 
  description: 'text',
  'specifications.engine': 'text',
  'specifications.features': 'text'
}, {
  weights: {
    name: 10,
    model: 8,
    description: 5,
    'specifications.engine': 3,
    'specifications.features': 1
  },
  name: 'car_text_search'
});

// Compound indexes cho các query phổ biến
CarSchema.index({ isAvailable: 1, category: 1, price: 1 }, { name: 'available_category_price' });
CarSchema.index({ isAvailable: 1, model: 1, year: -1 }, { name: 'available_model_year' });
CarSchema.index({ isAvailable: 1, price: 1, year: -1 }, { name: 'available_price_year' });
CarSchema.index({ isAvailable: 1, 'specifications.seating': 1 }, { name: 'available_seating' });

// Single field indexes
CarSchema.index({ createdAt: -1 }, { name: 'created_desc' });
CarSchema.index({ updatedAt: -1 }, { name: 'updated_desc' });
CarSchema.index({ category: 1 }, { name: 'category_asc' });

// Sparse index cho các trường không bắt buộc
CarSchema.index({ color: 1 }, { sparse: true, name: 'color_sparse' });

export default mongoose.models.Car || mongoose.model<CarDocument>('Car', CarSchema);
