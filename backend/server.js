const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { swaggerUi, specs } = require('./config/swagger');
const swaggerLogger = require('./middleware/swaggerLogger');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const orderRoutes = require('./routes/orders');
const testDriveRoutes = require('./routes/testDrive');
const contactRoutes = require('./routes/contact');
const newsRoutes = require('./routes/news');
const userRoutes = require('./routes/users');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.'
  }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger logging middleware
app.use(swaggerLogger);

// Static files
app.use('/uploads', express.static('public/uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vinfast_db')
.then(() => {
  console.log('✅ Kết nối MongoDB thành công');
})
.catch((err) => {
  console.error('❌ Lỗi kết nối MongoDB:', err.message);
  process.exit(1);
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VinFast API Documentation'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/test-drive', testDriveRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'VinFast API đang hoạt động',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});
