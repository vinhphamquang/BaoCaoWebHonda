import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestDrive from '@/models/TestDrive';
import Car from '@/models/Car';

// POST /api/test-drive - Tạo lịch lái thử mới
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      carId,
      preferredDate,
      preferredTime,
      alternativeDate,
      alternativeTime,
      showroom,
      experience,
      licenseNumber,
      message
    } = body;

    // Validation cơ bản
    if (!customerName || !customerEmail || !customerPhone || !carId || !preferredDate || !preferredTime || !showroom || !experience) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Thiếu thông tin bắt buộc' 
        },
        { status: 400 }
      );
    }

    // Kiểm tra xe có tồn tại không
    let carInfo = null;
    try {
      carInfo = await Car.findById(carId);
      if (!carInfo) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Xe không tồn tại' 
          },
          { status: 404 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID xe không hợp lệ' 
        },
        { status: 400 }
      );
    }

    // Kiểm tra ngày lái thử phải là tương lai
    const testDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (testDate <= today) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ngày lái thử phải là ngày trong tương lai' 
        },
        { status: 400 }
      );
    }

    // Kiểm tra xem đã có lịch hẹn trùng không
    const existingBooking = await TestDrive.findOne({
      showroom,
      preferredDate: testDate,
      preferredTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Khung giờ này đã được đặt. Vui lòng chọn giờ khác.' 
        },
        { status: 409 }
      );
    }

    // Tạo lịch lái thử mới
    const testDrive = new TestDrive({
      customerName: customerName.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress?.trim(),
      carId,
      carName: carInfo.name,
      carModel: carInfo.model,
      preferredDate: testDate,
      preferredTime,
      alternativeDate: alternativeDate ? new Date(alternativeDate) : undefined,
      alternativeTime,
      showroom,
      experience,
      licenseNumber: licenseNumber?.trim(),
      message: message?.trim(),
      status: 'pending'
    });

    await testDrive.save();

    // TODO: Gửi email xác nhận cho khách hàng
    // TODO: Gửi thông báo cho showroom

    return NextResponse.json({
      success: true,
      message: 'Đặt lịch lái thử thành công',
      data: {
        id: testDrive._id,
        customerName: testDrive.customerName,
        carName: testDrive.carName,
        preferredDate: testDrive.preferredDate,
        preferredTime: testDrive.preferredTime,
        showroom: testDrive.showroom,
        status: testDrive.status
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating test drive booking:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET /api/test-drive - Lấy danh sách lịch lái thử (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;
    
    // Filters
    const status = searchParams.get('status');
    const showroom = searchParams.get('showroom');
    const customerEmail = searchParams.get('customerEmail');
    const carId = searchParams.get('carId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    // Build filter query
    const filter: any = {};
    
    if (status) filter.status = status;
    if (showroom) filter.showroom = showroom;
    if (customerEmail) filter.customerEmail = { $regex: customerEmail, $options: 'i' };
    if (carId) filter.carId = carId;
    
    if (fromDate || toDate) {
      filter.preferredDate = {};
      if (fromDate) filter.preferredDate.$gte = new Date(fromDate);
      if (toDate) filter.preferredDate.$lte = new Date(toDate);
    }

    // Execute query with aggregation for better performance
    const pipeline = [
      { $match: filter },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ];

    const [result] = await TestDrive.aggregate(pipeline);
    
    const testDrives = result.data || [];
    const total = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: testDrives,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching test drive bookings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi khi lấy danh sách lịch lái thử',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}