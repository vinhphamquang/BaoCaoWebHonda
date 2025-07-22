import mongoose, { Schema, Document } from 'mongoose';

export interface TestDriveDocument extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  carId: string;
  carName?: string;
  carModel?: string;
  preferredDate: Date;
  preferredTime: string;
  alternativeDate?: Date;
  alternativeTime?: string;
  showroom: string;
  experience: 'first-time' | 'experienced' | 'expert';
  licenseNumber?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmedDate?: Date;
  confirmedTime?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestDriveSchema = new Schema<TestDriveDocument>({
  // Thông tin khách hàng
  customerName: {
    type: String,
    required: [true, 'Tên khách hàng là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không được vượt quá 100 ký tự']
  },
  customerEmail: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  customerPhone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    match: [
      /^[0-9]{10,11}$/,
      'Số điện thoại không hợp lệ'
    ]
  },
  customerAddress: {
    type: String,
    trim: true,
    maxlength: [500, 'Địa chỉ không được vượt quá 500 ký tự']
  },

  // Thông tin xe
  carId: {
    type: String,
    required: [true, 'ID xe là bắt buộc']
  },
  carName: {
    type: String,
    trim: true
  },
  carModel: {
    type: String,
    trim: true
  },

  // Thông tin lịch hẹn
  preferredDate: {
    type: Date,
    required: [true, 'Ngày lái thử là bắt buộc'],
    validate: {
      validator: function(date: Date) {
        return date > new Date();
      },
      message: 'Ngày lái thử phải là ngày trong tương lai'
    }
  },
  preferredTime: {
    type: String,
    required: [true, 'Giờ lái thử là bắt buộc'],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Định dạng giờ không hợp lệ (HH:MM)'
    ]
  },
  alternativeDate: {
    type: Date,
    validate: {
      validator: function(date: Date) {
        return !date || date > new Date();
      },
      message: 'Ngày dự phòng phải là ngày trong tương lai'
    }
  },
  alternativeTime: {
    type: String,
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Định dạng giờ không hợp lệ (HH:MM)'
    ]
  },

  // Thông tin showroom
  showroom: {
    type: String,
    required: [true, 'Showroom là bắt buộc'],
    enum: [
      'Honda Quận 1',
      'Honda Quận 3', 
      'Honda Quận 7',
      'Honda Thủ Đức',
      'Honda Bình Thạnh',
      'Honda Gò Vấp'
    ]
  },

  // Thông tin kinh nghiệm
  experience: {
    type: String,
    required: [true, 'Mức độ kinh nghiệm là bắt buộc'],
    enum: ['first-time', 'experienced', 'expert']
  },
  licenseNumber: {
    type: String,
    trim: true,
    maxlength: [20, 'Số bằng lái không được vượt quá 20 ký tự']
  },

  // Ghi chú
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Ghi chú không được vượt quá 1000 ký tự']
  },

  // Trạng thái và xác nhận
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  confirmedDate: {
    type: Date
  },
  confirmedTime: {
    type: String,
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Định dạng giờ không hợp lệ (HH:MM)'
    ]
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Ghi chú nội bộ không được vượt quá 1000 ký tự']
  }
}, {
  timestamps: true
});

// Indexes để tối ưu hiệu suất
TestDriveSchema.index({ customerEmail: 1 });
TestDriveSchema.index({ customerPhone: 1 });
TestDriveSchema.index({ carId: 1 });
TestDriveSchema.index({ preferredDate: 1, showroom: 1 });
TestDriveSchema.index({ status: 1 });
TestDriveSchema.index({ createdAt: -1 });

// Compound index cho tìm kiếm theo showroom và ngày
TestDriveSchema.index({ showroom: 1, preferredDate: 1, preferredTime: 1 });

// Virtual để format ngày giờ
TestDriveSchema.virtual('formattedPreferredDateTime').get(function() {
  return `${this.preferredDate.toLocaleDateString('vi-VN')} ${this.preferredTime}`;
});

TestDriveSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('vi-VN');
});

// Method để cập nhật trạng thái
TestDriveSchema.methods.confirm = function(confirmedDate?: Date, confirmedTime?: string) {
  this.status = 'confirmed';
  this.confirmedDate = confirmedDate || this.preferredDate;
  this.confirmedTime = confirmedTime || this.preferredTime;
  return this.save();
};

TestDriveSchema.methods.cancel = function(reason?: string) {
  this.status = 'cancelled';
  if (reason) {
    this.notes = (this.notes || '') + `\nHủy lịch: ${reason}`;
  }
  return this.save();
};

TestDriveSchema.methods.complete = function(notes?: string) {
  this.status = 'completed';
  if (notes) {
    this.notes = (this.notes || '') + `\nHoàn thành: ${notes}`;
  }
  return this.save();
};

// Transform để loại bỏ sensitive data khi trả về JSON
TestDriveSchema.methods.toJSON = function() {
  const testDriveObject = this.toObject();
  // Có thể ẩn một số thông tin nếu cần
  return testDriveObject;
};

export default mongoose.models.TestDrive || mongoose.model<TestDriveDocument>('TestDrive', TestDriveSchema);