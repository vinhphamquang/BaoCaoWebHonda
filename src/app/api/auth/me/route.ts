import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Lấy token từ cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy token xác thực' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    // Tìm user theo ID từ token
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin
      }
    });

  } catch (error: any) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi lấy thông tin người dùng' },
      { status: 500 }
    );
  }
}