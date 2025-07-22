import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import { sampleCars } from '@/lib/seedData';

// POST /api/seed - Seed database với dữ liệu mẫu
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Xóa tất cả dữ liệu cũ
    await Car.deleteMany({});

    // Thêm dữ liệu mẫu
    const cars = await Car.insertMany(sampleCars);

    return NextResponse.json({
      success: true,
      message: `Đã seed thành công ${cars.length} xe Honda`,
      data: cars,
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi seed database' },
      { status: 500 }
    );
  }
}

// GET /api/seed - Kiểm tra trạng thái database
export async function GET() {
  try {
    await connectDB();

    const carCount = await Car.countDocuments();

    return NextResponse.json({
      success: true,
      message: `Database hiện có ${carCount} xe`,
      carCount,
    });

  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi kiểm tra database' },
      { status: 500 }
    );
  }
}
