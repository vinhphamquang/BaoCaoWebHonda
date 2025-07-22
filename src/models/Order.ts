import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '@/types';

export interface OrderDocument extends Order, Document {}

const OrderSchema = new Schema<OrderDocument>({
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Tên khách hàng là bắt buộc'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, 'Địa chỉ đường là bắt buộc'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'Thành phố là bắt buộc'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'Tỉnh/Thành phố là bắt buộc'],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Mã bưu điện là bắt buộc'],
        trim: true,
      },
    },
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'ID xe là bắt buộc'],
  },
  quantity: {
    type: Number,
    required: [true, 'Số lượng là bắt buộc'],
    min: [1, 'Số lượng phải ít nhất là 1'],
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: [true, 'Tổng giá là bắt buộc'],
    min: [0, 'Tổng giá phải lớn hơn 0'],
  },
  status: {
    type: String,
    required: [true, 'Trạng thái đơn hàng là bắt buộc'],
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Ghi chú không được quá 500 ký tự'],
  },
}, {
  timestamps: true,
});

// Tạo index cho tìm kiếm và sắp xếp
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'customerInfo.email': 1 });
OrderSchema.index({ carId: 1 });

export default mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema);
