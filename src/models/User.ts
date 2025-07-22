import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  lastLogin?: Date;
  favoriteCarIds: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không được vượt quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false // Không trả về password khi query
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^[0-9]{10,11}$/,
      'Số điện thoại không hợp lệ'
    ]
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Địa chỉ không được vượt quá 500 ký tự']
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpiry: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  favoriteCarIds: [{
    type: String,
    ref: 'Car'
  }]
}, {
  timestamps: true
});

// Index cho tìm kiếm và performance
UserSchema.index({ email: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ createdAt: -1 });

// Middleware để hash password trước khi save
UserSchema.pre('save', async function(next) {
  // Chỉ hash password nếu nó được modify
  if (!this.isModified('password')) return next();

  try {
    // Hash password với cost factor 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method để so sánh password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Lỗi khi so sánh mật khẩu');
  }
};

// Middleware để update lastLogin
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Virtual để format thời gian
UserSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('vi-VN');
});

// Transform để loại bỏ sensitive data khi trả về JSON
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpiry;
  return userObject;
};

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);