import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    // Tìm user theo email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Không tiết lộ thông tin user có tồn tại hay không
      return NextResponse.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu'
      });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Lưu token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // TODO: Gửi email với reset link
    // Trong production, bạn sẽ cần implement email service
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('Reset password URL:', resetUrl); // For development only

    // Simulate email sending
    // await sendResetPasswordEmail(user.email, resetUrl);

    return NextResponse.json({
      success: true,
      message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn'
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}