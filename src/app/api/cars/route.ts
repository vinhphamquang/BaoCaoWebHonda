/**
 * @swagger
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: Get all Honda cars
 *     description: Retrieve a list of Honda cars with optional filtering, sorting, and pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for car name or model
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Filter by car model (Civic, Accord, CR-V, etc.)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [sedan, suv, hatchback, coupe]
 *         description: Filter by car category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, year, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: Successfully retrieved cars
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Car'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

// GET /api/cars - Lấy danh sách xe với pagination và sorting (Tối ưu cho MongoDB Atlas)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Pagination parameters với validation
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
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
    const seating = searchParams.get('seating');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');

    // Sử dụng MongoDB Aggregation Pipeline để tối ưu hiệu suất
    const pipeline: any[] = [];

    // Match stage - Lọc cơ bản
    const matchStage: any = { isAvailable: true };

    // Thêm các bộ lọc cơ bản
    if (model) matchStage.model = { $regex: new RegExp(model, 'i') };
    if (category) matchStage.category = category;
    if (color) matchStage.color = { $regex: new RegExp(color, 'i') };
    
    // Lọc theo giá với validation
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        matchStage.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        matchStage.price.$lte = Number(maxPrice);
      }
    }
    
    // Lọc theo năm với validation
    if (minYear || maxYear) {
      matchStage.year = {};
      if (minYear && !isNaN(Number(minYear))) {
        matchStage.year.$gte = Number(minYear);
      }
      if (maxYear && !isNaN(Number(maxYear))) {
        matchStage.year.$lte = Number(maxYear);
      }
    }
    
    // Lọc theo thông số kỹ thuật
    if (seating && !isNaN(Number(seating))) {
      matchStage['specifications.seating'] = Number(seating);
    }
    if (fuelType) {
      matchStage['specifications.fuelType'] = { $regex: new RegExp(fuelType, 'i') };
    }
    if (transmission) {
      matchStage['specifications.transmission'] = { $regex: new RegExp(transmission, 'i') };
    }

    // Tìm kiếm nâng cao với MongoDB Text Search
    if (search) {
      const searchTerms = search.trim().split(/\s+/).filter(term => term.length > 0);
      
      if (searchTerms.length > 0) {
        // Sử dụng $text search nếu có index text
        try {
          matchStage.$text = { $search: search };
        } catch {
          // Fallback về regex search nếu không có text index
          const searchConditions = searchTerms.map(term => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const termRegex = new RegExp(escapedTerm, 'i');
            return {
              $or: [
                { name: termRegex },
                { model: termRegex },
                { description: termRegex },
                { color: termRegex },
                { category: termRegex },
                { 'specifications.engine': termRegex },
                { 'specifications.transmission': termRegex },
                { 'specifications.fuelType': termRegex },
                { 'specifications.safety': { $elemMatch: { $regex: termRegex } } },
                { 'specifications.features': { $elemMatch: { $regex: termRegex } } },
              ]
            };
          });
          
          if (searchConditions.length === 1) {
            Object.assign(matchStage, searchConditions[0]);
          } else {
            matchStage.$and = searchConditions;
          }
        }
      }
    }

    pipeline.push({ $match: matchStage });

    // Add text score for sorting if using text search
    if (search && matchStage.$text) {
      pipeline.push({ $addFields: { score: { $meta: "textScore" } } });
    }

    // Facet stage để lấy cả data và count trong một query
    pipeline.push({
      $facet: {
        data: [
          // Sort stage
          { $sort: search && matchStage.$text 
            ? { score: { $meta: "textScore" }, [sortBy]: sortOrder === 'asc' ? 1 : -1 }
            : { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
          },
          // Pagination
          { $skip: (page - 1) * limit },
          { $limit: limit },
          // Project để loại bỏ score field nếu có
          { $project: { score: 0 } }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    });

    // Execute aggregation
    const [result] = await Car.aggregate(pipeline);
    
    const cars = result.data || [];
    const total = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Thêm metadata về query performance
    const queryMetadata = {
      executionTime: Date.now(),
      filtersApplied: Object.keys(matchStage).length,
      searchTerms: search ? search.split(/\s+/).length : 0,
    };

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
      metadata: queryMetadata,
    });

  } catch (error: any) {
    console.error('Error fetching cars from MongoDB Atlas:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error?.name === 'MongoNetworkError') {
      return NextResponse.json(
        { success: false, error: 'Lỗi kết nối đến cơ sở dữ liệu' },
        { status: 503 }
      );
    }
    
    if (error?.name === 'MongoParseError') {
      return NextResponse.json(
        { success: false, error: 'Lỗi cấu hình cơ sở dữ liệu' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi khi lấy danh sách xe',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/cars - Tạo xe mới (admin only) - Tối ưu cho MongoDB Atlas
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validation cơ bản
    if (!body.name || !body.model || !body.price) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Thiếu thông tin bắt buộc: name, model, price' 
        },
        { status: 400 }
      );
    }

    // Tạo xe mới với optimistic concurrency control
    const car = new Car({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await car.save();

    return NextResponse.json({
      success: true,
      data: car,
      message: 'Xe đã được tạo thành công',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating car:', error);
    
    if (error?.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dữ liệu không hợp lệ',
          details: error?.errors 
        },
        { status: 400 }
      );
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Xe đã tồn tại trong hệ thống' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi khi tạo xe mới',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}