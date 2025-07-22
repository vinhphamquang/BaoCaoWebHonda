import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TestDrive from '@/models/TestDrive';

// GET /api/test-drive/available-slots - Lấy khung giờ trống
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const showroom = searchParams.get('showroom');
    const date = searchParams.get('date');

    if (!showroom || !date) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Thiếu thông tin showroom hoặc ngày' 
        },
        { status: 400 }
      );
    }

    // Kiểm tra ngày hợp lệ
    const testDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (testDate <= today) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ngày phải là ngày trong tương lai' 
        },
        { status: 400 }
      );
    }

    // Định nghĩa các khung giờ có sẵn
    const timeSlots = [
      { time: '08:00', label: 'Sáng sớm' },
      { time: '08:30', label: 'Sáng sớm' },
      { time: '09:00', label: 'Sáng' },
      { time: '09:30', label: 'Sáng' },
      { time: '10:00', label: 'Sáng' },
      { time: '10:30', label: 'Sáng' },
      { time: '11:00', label: 'Sáng' },
      { time: '11:30', label: 'Sáng' },
      { time: '13:30', label: 'Chiều' },
      { time: '14:00', label: 'Chiều' },
      { time: '14:30', label: 'Chiều' },
      { time: '15:00', label: 'Chiều' },
      { time: '15:30', label: 'Chiều' },
      { time: '16:00', label: 'Chiều' },
      { time: '16:30', label: 'Chiều' },
      { time: '17:00', label: 'Chiều' },
      { time: '17:30', label: 'Chiều' }
    ];

    // Lấy các lịch hẹn đã đặt cho ngày và showroom này
    const bookedSlots = await TestDrive.find({
      showroom,
      preferredDate: testDate,
      status: { $in: ['pending', 'confirmed'] }
    }).select('preferredTime');

    const bookedTimes = bookedSlots.map(booking => booking.preferredTime);

    // Kiểm tra khung giờ nào còn trống
    const availableSlots = timeSlots.map(slot => ({
      ...slot,
      available: !bookedTimes.includes(slot.time)
    }));

    // Nếu là ngày hôm nay, loại bỏ các khung giờ đã qua
    if (testDate.toDateString() === new Date().toDateString()) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      availableSlots.forEach(slot => {
        const [slotHour, slotMinute] = slot.time.split(':').map(Number);
        const slotTotalMinutes = slotHour * 60 + slotMinute;
        const currentTotalMinutes = currentHour * 60 + currentMinute;
        
        // Cần ít nhất 2 giờ để chuẩn bị
        if (slotTotalMinutes <= currentTotalMinutes + 120) {
          slot.available = false;
        }
      });
    }

    // Thống kê
    const totalSlots = availableSlots.length;
    const availableCount = availableSlots.filter(slot => slot.available).length;
    const bookedCount = totalSlots - availableCount;

    return NextResponse.json({
      success: true,
      data: {
        showroom,
        date,
        availableSlots: availableSlots.filter(slot => slot.available),
        allSlots: availableSlots,
        statistics: {
          total: totalSlots,
          available: availableCount,
          booked: bookedCount
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi khi lấy khung giờ trống',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}