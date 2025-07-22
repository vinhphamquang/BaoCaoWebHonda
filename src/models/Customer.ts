import mongoose, { Schema, Document } from 'mongoose';
import { Customer } from '@/types';
import bcrypt from 'bcryptjs';

export interface CustomerDocument extends Omit<Customer, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const CustomerSchema = new Schema<CustomerDocument>({
  name: {
    type: String,
    required: [true, 'Tên khách hàng là bắt buộc'],
    trim: true,
    minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
    maxlength: [50, 'Tên không được quá 50 ký tự'],
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false, // Không trả về password khi query
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    match: [/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'],
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
      match: [/^[0-9]{5,6}$/, 'Mã bưu điện phải có 5-6 chữ số'],
    },
  },
}, {
  timestamps: true,
});

// Tạo index cho email để tìm kiếm nhanh
CustomerSchema.index({ email: 1 });

// Middleware để hash password trước khi lưu
CustomerSchema.pre('save', async function(next) {
  // Chỉ hash password nếu nó được sửa đổi hoặc là mới
  if (!this.isModified('password')) return next();
  
  try {
    // Tạo salt và hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Phương thức so sánh password
CustomerSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Sử dụng bcrypt để so sánh password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.models.Customer || mongoose.model<CustomerDocument>('Customer', CustomerSchema);
