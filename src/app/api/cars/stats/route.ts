import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

// GET /api/cars/stats - Lấy thống kê xe (Tối ưu cho MongoDB Atlas)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Sử dụng MongoDB Aggregation Pipeline để lấy thống kê
    const statsAggregation = await Car.aggregate([
      {
        $match: { isAvailable: true }
      },
      {
        $facet: {
          // Thống kê tổng quan
          overview: [
            {
              $group: {
                _id: null,
                totalCars: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgYear: { $avg: '$year' },
                minYear: { $min: '$year' },
                maxYear: { $max: '$year' }
              }
            }
          ],
          // Thống kê theo danh mục
          byCategory: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
              }
            },
            { $sort: { count: -1 } }
          ],
          // Thống kê theo model
          byModel: [
            {
              $group: {
                _id: '$model',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                years: { $addToSet: '$year' }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],
          // Thống kê theo năm
          byYear: [
            {
              $group: {
                _id: '$year',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                models: { $addToSet: '$model' }
              }
            },
            { $sort: { _id: -1 } }
          ],
          // Thống kê theo số chỗ ngồi
          bySeating: [
            {
              $group: {
                _id: '$specifications.seating',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' }
              }
            },
            { $sort: { _id: 1 } }
          ],
          // Thống kê theo loại nhiên liệu
          byFuelType: [
            {
              $group: {
                _id: '$specifications.fuelType',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' }
              }
            },
            { $sort: { count: -1 } }
          ],
          // Thống kê theo màu sắc
          byColor: [
            {
              $group: {
                _id: '$color',
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    const stats = statsAggregation[0];

    // Format dữ liệu trả về
    const formattedStats = {
      overview: stats.overview[0] || {
        totalCars: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgYear: 0,
        minYear: 0,
        maxYear: 0
      },
      categories: stats.byCategory || [],
      models: stats.byModel || [],
      years: stats.byYear || [],
      seating: stats.bySeating || [],
      fuelTypes: stats.byFuelType || [],
      colors: stats.byColor || [],
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: formattedStats,
      message: 'Thống kê xe được lấy thành công'
    });

  } catch (error: any) {
    console.error('Error fetching car statistics:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi khi lấy thống kê xe',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}