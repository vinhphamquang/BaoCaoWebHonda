import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';

// GET /api/cars/search - Tìm kiếm xe nâng cao (Tối ưu cho MongoDB Atlas)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
      }, { status: 400 });
    }

    // Sử dụng MongoDB Atlas Search với aggregation pipeline
    const searchPipeline = [
      {
        $match: {
          isAvailable: true,
          $text: { $search: query }
        }
      },
      {
        $addFields: {
          score: { $meta: "textScore" }
        }
      },
      {
        $sort: {
          score: { $meta: "textScore" },
          createdAt: -1
        }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 1,
          name: 1,
          model: 1,
          price: 1,
          year: 1,
          category: 1,
          color: 1,
          images: { $slice: ["$images", 1] }, // Chỉ lấy ảnh đầu tiên
          specifications: {
            engine: 1,
            transmission: 1,
            fuelType: 1,
            seating: 1
          },
          score: 1
        }
      }
    ];

    const searchResults = await Car.aggregate(searchPipeline);

    // Nếu không tìm thấy kết quả với text search, thử regex search
    let fallbackResults = [];
    if (searchResults.length === 0) {
      const regexQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(regexQuery, 'i');
      
      fallbackResults = await Car.find({
        isAvailable: true,
        $or: [
          { name: regex },
          { model: regex },
          { description: regex },
          { color: regex },
          { 'specifications.engine': regex }
        ]
      })
      .select('_id name model price year category color images specifications.engine specifications.transmission specifications.fuelType specifications.seating')
      .limit(limit)
      .lean();
    }

    const results = searchResults.length > 0 ? searchResults : fallbackResults;

    // Thêm gợi ý tìm kiếm nếu không có kết quả
    let suggestions = [];
    if (results.length === 0) {
      // Tìm các model tương tự
      const modelSuggestions = await Car.distinct('model', { isAvailable: true });
      suggestions = modelSuggestions
        .filter(model => model.toLowerCase().includes(query.toLowerCase().substring(0, 3)))
        .slice(0, 5);
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        query,
        total: results.length,
        suggestions,
        searchType: searchResults.length > 0 ? 'text' : 'regex'
      },
      message: `Tìm thấy ${results.length} kết quả cho "${query}"`
    });

  } catch (error: any) {
    console.error('Error in car search:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi khi tìm kiếm xe',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/cars/search - Tìm kiếm nâng cao với filters phức tạp
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      query,
      filters = {},
      sort = { field: 'createdAt', order: 'desc' },
      limit = 10,
      page = 1
    } = body;

    const pipeline: any[] = [];

    // Match stage với filters phức tạp
    const matchStage: any = { isAvailable: true };

    // Text search nếu có query
    if (query && query.trim().length >= 2) {
      matchStage.$text = { $search: query };
    }

    // Áp dụng filters
    if (filters.priceRange) {
      matchStage.price = {};
      if (filters.priceRange.min) matchStage.price.$gte = filters.priceRange.min;
      if (filters.priceRange.max) matchStage.price.$lte = filters.priceRange.max;
    }

    if (filters.yearRange) {
      matchStage.year = {};
      if (filters.yearRange.min) matchStage.year.$gte = filters.yearRange.min;
      if (filters.yearRange.max) matchStage.year.$lte = filters.yearRange.max;
    }

    if (filters.categories && filters.categories.length > 0) {
      matchStage.category = { $in: filters.categories };
    }

    if (filters.models && filters.models.length > 0) {
      matchStage.model = { $in: filters.models };
    }

    if (filters.colors && filters.colors.length > 0) {
      matchStage.color = { $in: filters.colors };
    }

    if (filters.seating && filters.seating.length > 0) {
      matchStage['specifications.seating'] = { $in: filters.seating };
    }

    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      matchStage['specifications.fuelType'] = { $in: filters.fuelTypes };
    }

    pipeline.push({ $match: matchStage });

    // Add text score if using text search
    if (query && matchStage.$text) {
      pipeline.push({ $addFields: { score: { $meta: "textScore" } } });
    }

    // Facet để lấy cả results và count
    pipeline.push({
      $facet: {
        results: [
          // Sort
          {
            $sort: query && matchStage.$text
              ? { score: { $meta: "textScore" }, [sort.field]: sort.order === 'asc' ? 1 : -1 }
              : { [sort.field]: sort.order === 'asc' ? 1 : -1 }
          },
          // Pagination
          { $skip: (page - 1) * limit },
          { $limit: limit },
          // Project
          {
            $project: {
              score: 0 // Remove score from final results
            }
          }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }
    });

    const [result] = await Car.aggregate(pipeline);
    
    const results = result.results || [];
    const total = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        results,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: filters,
        query
      },
      message: `Tìm thấy ${total} kết quả`
    });

  } catch (error: any) {
    console.error('Error in advanced car search:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Lỗi khi tìm kiếm nâng cao',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}