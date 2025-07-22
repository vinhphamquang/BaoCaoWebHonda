import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Vui lòng điền đầy đủ thông tin' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email không hợp lệ' 
        },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Số điện thoại không hợp lệ' 
        },
        { status: 400 }
      );
    }

    // Create new contact
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.replace(/\s/g, ''),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
      priority: 'medium'
    });

    await contact.save();

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });

  } catch (error: any) {
    console.error('Contact form error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: errors[0] || 'Dữ liệu không hợp lệ' 
        },
        { status: 400 }
      );
    }

    // Handle duplicate email (if unique constraint is added)
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email này đã được sử dụng để liên hệ trước đó' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Get total count
    const total = await Contact.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error: any) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Có lỗi xảy ra khi lấy danh sách liên hệ' 
      },
      { status: 500 }
    );
  }
}