import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các đường dẫn yêu cầu xác thực
const protectedRoutes = [
  '/profile',
  '/profile/favorites',
  '/memberships',
];

// Các đường dẫn dành cho người dùng chưa đăng nhập
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  // Kiểm tra nếu người dùng truy cập trang yêu cầu xác thực nhưng chưa đăng nhập
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Kiểm tra nếu người dùng đã đăng nhập nhưng truy cập trang đăng nhập/đăng ký
  // Chỉ redirect nếu không phải debug routes
  if (authRoutes.some(route => pathname.startsWith(route)) && token && !pathname.startsWith('/clear-auth')) {
    // Trong development, cho phép truy cập để debug
    if (process.env.NODE_ENV === 'development' && request.nextUrl.searchParams.get('debug') === 'true') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/memberships/:path*',
    '/login',
    '/register',
    '/clear-auth',
  ],
};