import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import { FilterOptions, PaginationOptions } from '@/types';

// GET /api/cars - Lấy danh sách xe với pagination và sorting
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Filter parameters
    const model = searchParams.get('model');
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const search = searchParams.get('search');

    // Build filter query
    const filter: any = { isAvailable: true };

    if (model) filter.model = { $regex: model, $options: 'i' };
    if (category) filter.category = category;
    if (color) filter.color = { $regex: color, $options: 'i' };
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    if (minYear || maxYear) {
      filter.year = {};
      if (minYear) filter.year.$gte = parseInt(minYear);
      if (maxYear) filter.year.$lte = parseInt(maxYear);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [cars, total] = await Promise.all([
      Car.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Car.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: cars,
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
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi khi lấy danh sách xe' },
      { status: 500 }
    );
  }
}

// POST /api/cars - Tạo xe mới (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    const car = new Car(body);
    await car.save();

    return NextResponse.json({
      success: true,
      data: car,
      message: 'Xe đã được tạo thành công',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating car:', error);
    
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
      { success: false, error: 'Lỗi khi tạo xe mới' },
      { status: 500 }
    );
  }
}
