import mongoose, { Document, Schema } from 'mongoose';

export interface ContactDocument extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<ContactDocument>({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không được vượt quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    match: [
      /^[0-9]{10,11}$/,
      'Số điện thoại không hợp lệ'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Chủ đề là bắt buộc'],
    trim: true,
    maxlength: [200, 'Chủ đề không được vượt quá 200 ký tự']
  },
  message: {
    type: String,
    required: [true, 'Nội dung tin nhắn là bắt buộc'],
    trim: true,
    maxlength: [2000, 'Tin nhắn không được vượt quá 2000 ký tự']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Ghi chú không được vượt quá 1000 ký tự']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ priority: 1, status: 1 });

// Virtual for formatted creation date
ContactSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Ensure virtual fields are serialized
ContactSchema.set('toJSON', {
  virtuals: true
});

const Contact = mongoose.models.Contact || mongoose.model<ContactDocument>('Contact', ContactSchema);

export default Contact;