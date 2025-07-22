import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { createTokenResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    console.log('API Register: Received request');
    
    // Kết nối đến database
    await connectDB();
    console.log('API Register: Connected to database');

    // Lấy dữ liệu từ request body
    const body = await req.json();
    console.log('API Register: Request body received:', body);
    
    const { name, email, password, phone, address } = body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password || !phone || !address) {
      console.log('API Register: Missing required fields', { name, email, password, phone, address });
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      console.log('API Register: Email already exists', email);
      return NextResponse.json(
        { success: false, message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }
    
    console.log('API Register: Creating new customer');
    
    // Tạo khách hàng mới
    const customer = await Customer.create({
      name,
      email,
      password,
      phone,
      address,
    });
    
    console.log('API Register: Customer created successfully', { id: customer._id });

    // Tạo response với token
    console.log('API Register: Creating token response');
    const response = createTokenResponse(customer, 'Đăng ký thành công');
    console.log('API Register: Registration completed successfully');
    return response;
  } catch (error: any) {
    console.error('API Register: Error during registration:', error);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi khi đăng ký' },
      { status: 500 }
    );
  }
}