import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Tạo response
    const response = NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

    // Xóa cookie token
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi đăng xuất' },
      { status: 500 }
    );
  }
}