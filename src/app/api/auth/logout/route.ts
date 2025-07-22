import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Tạo response
    const response = NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công',
    });

    // Xóa cookie token
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Hết hạn ngay lập tức
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Lỗi đăng xuất:', error.message);
    return NextResponse.json(
      { success: false, message: 'Đã xảy ra lỗi khi đăng xuất' },
      { status: 500 }
    );
  }
}