import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import mongoose from 'mongoose';

// GET /api/cars/[id] - Lấy chi tiết xe theo ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    await connectDB();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID xe không hợp lệ' },
        { status: 400 }
      );
    }

    const car = await Car.findById(id).lean();

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy xe' },
        { status: 404 }
      );
    }

    if (!car.isAvailable) {
      return NextResponse.json(
        { success: false, error: 'Xe này hiện không có sẵn' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car,
    });

  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy thông tin xe' },
      { status: 500 }
    );
  }
}

// PUT /api/cars/[id] - Cập nhật thông tin xe (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID xe không hợp lệ' },
        { status: 400 }
      );
    }

    const car = await Car.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy xe' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car,
      message: 'Xe đã được cập nhật thành công',
    });

  } catch (error: Error | unknown) {
    console.error('Error updating car:', error);
    
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
      { success: false, error: 'Lỗi khi cập nhật xe' },
      { status: 500 }
    );
  }
}

// DELETE /api/cars/[id] - Xóa xe (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    await connectDB();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID xe không hợp lệ' },
        { status: 400 }
      );
    }

    const car = await Car.findByIdAndUpdate(
      id,
      { isAvailable: false },
      { new: true }
    );

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy xe' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Xe đã được xóa thành công',
    });

  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xóa xe' },
      { status: 500 }
    );
  }
}
