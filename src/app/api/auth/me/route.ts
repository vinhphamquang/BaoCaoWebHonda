import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { authenticateRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Xác thực request
    const decoded = await authenticateRequest(req);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Không được phép truy cập' },
        { status: 401 }
      );
    }

    // Kết nối đến database
    await connectDB();

    // Tìm khách hàng theo id
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    // Trả về thông tin khách hàng
    return NextResponse.json({
      success: true,
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error: any) {
    console.error('Lỗi lấy thông tin người dùng:', error.message);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' },
      { status: 500 }
    );
  }
}