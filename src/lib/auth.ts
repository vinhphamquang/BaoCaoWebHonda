import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { CustomerDocument } from '@/models/Customer';

// Lấy JWT secret từ biến môi trường
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Tạo JWT token
export const createToken = (customer: CustomerDocument) => {
  // Không bao gồm password trong payload
  const payload = {
    id: customer._id,
    email: customer.email,
    name: customer.name,
  };

  // Tạo token với thời hạn 7 ngày
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Xác thực token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware để xác thực request
export const authenticateRequest = async (req: NextRequest) => {
  // Lấy token từ cookie hoặc header
  const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  // Xác thực token
  const decoded = verifyToken(token);
  return decoded;
};

// Tạo response với token
export const createTokenResponse = (customer: CustomerDocument, message: string) => {
  console.log('createTokenResponse: Creating token for customer', { id: customer._id });
  const token = createToken(customer);
  console.log('createTokenResponse: Token created successfully');

  // Tạo response với cookie
  console.log('createTokenResponse: Creating JSON response with message:', message);
  const response = NextResponse.json({
    success: true,
    message,
    user: {
      id: customer._id,
      name: customer.name,
      email: customer.email,
    },
  });
  console.log('createTokenResponse: JSON response created');

  // Thêm cookie với token
  console.log('createTokenResponse: Setting cookie with token');
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    path: '/',
  });
  console.log('createTokenResponse: Cookie set successfully');

  console.log('createTokenResponse: Returning response');
  return response;
};