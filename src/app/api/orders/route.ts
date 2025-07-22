import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Car from '@/models/Car';
import mongoose from 'mongoose';

// POST /api/orders - Tạo đơn hàng mới
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { customerInfo, carId, quantity = 1, notes } = body;

    // Validate required fields
    if (!customerInfo || !carId) {
      return NextResponse.json(
        { success: false, error: 'Thông tin khách hàng và ID xe là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return NextResponse.json(
        { success: false, error: 'ID xe không hợp lệ' },
        { status: 400 }
      );
    }

    // Check if car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy xe' },
        { status: 404 }
      );
    }

    if (!car.isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Xe này hiện không có sẵn' },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = car.price * quantity;

    // Create order
    const order = new Order({
      customerInfo,
      carId,
      quantity,
      totalPrice,
      notes,
      status: 'pending',
    });

    await order.save();

    // Populate car information
    await order.populate('carId');

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Đơn hàng đã được tạo thành công',
    }, { status: 201 });

  } catch (error: Error | unknown) {
    console.error('Error creating order:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dữ liệu không hợp lệ',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Lỗi khi tạo đơn hàng' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Lấy danh sách đơn hàng (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    // Build filter query
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (email) filter['customerInfo.email'] = { $regex: email, $options: 'i' };

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('carId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách đơn hàng' },
      { status: 500 }
    );
  }
}
