import { NextResponse } from 'next/server';
import { mockCars } from '@/lib/mock-data';

// GET /api/test - Test endpoint không cần MongoDB
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'API Honda Plus hoạt động bình thường',
      data: {
        totalCars: mockCars.length,
        sampleCars: mockCars.slice(0, 2),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi API test',
        details: error?.message 
      },
      { status: 500 }
    );
  }
}