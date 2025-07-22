import mongoose, { Schema, Document } from 'mongoose';
import { Membership } from '@/types';

export interface MembershipDocument extends Omit<Membership, '_id'>, Document {}

const MembershipSchema = new Schema<MembershipDocument>({
  customerId: {
    type: String,
    required: [true, 'ID khách hàng là bắt buộc'],
    ref: 'Customer'
  },
  tier: {
    type: String,
    required: [true, 'Cấp độ thành viên là bắt buộc'],
    enum: ['silver', 'gold', 'platinum'],
    default: 'silver'
  },
  startDate: {
    type: Date,
    required: [true, 'Ngày bắt đầu là bắt buộc'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Ngày kết thúc là bắt buộc']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  benefits: [{
    type: String
  }]
}, {
  timestamps: true
});

// Tạo index cho customerId để tìm kiếm nhanh
MembershipSchema.index({ customerId: 1 });

export default mongoose.models.Membership || mongoose.model<MembershipDocument>('Membership', MembershipSchema);