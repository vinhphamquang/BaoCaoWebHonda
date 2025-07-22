import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { createTokenResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Kết nối đến database
    await connectDB();

    // Lấy dữ liệu từ request body
    const { email, password } = await req.json();

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      );
    }

    // Tìm khách hàng theo email và bao gồm trường password
    const customer = await Customer.findOne({ email }).select('+password');
    
    // Kiểm tra khách hàng tồn tại
    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await customer.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Tạo response với token
    return createTokenResponse(customer, 'Đăng nhập thành công');
  } catch (error: any) {
    console.error('Lỗi đăng nhập:', error.message);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi khi đăng nhập' },
      { status: 500 }
    );
  }
}