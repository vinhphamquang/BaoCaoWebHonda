const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Tài nguyên không tồn tại';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Dữ liệu đã tồn tại';
    
    // Extract field name from error
    const field = Object.keys(err.keyValue)[0];
    if (field === 'email') {
      message = 'Email đã được sử dụng';
    } else if (field === 'phone') {
      message = 'Số điện thoại đã được sử dụng';
    } else if (field === 'slug') {
      message = 'Tiêu đề đã tồn tại';
    }
    
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token không hợp lệ';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token đã hết hạn';
    error = new ErrorResponse(message, 401);
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File quá lớn';
    error = new ErrorResponse(message, 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Loại file không được hỗ trợ';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Lỗi server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
