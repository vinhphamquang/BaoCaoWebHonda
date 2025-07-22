import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Tìm user theo email và include password để so sánh
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Kiểm tra account có active không
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản đã bị vô hiệu hóa' },
        { status: 401 }
      );
    }

    // So sánh password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Cập nhật last login
    user.lastLogin = new Date();
    await user.save();

    // Tạo JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Tạo response
    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}