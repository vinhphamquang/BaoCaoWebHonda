const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VinFast API Documentation',
      version: '1.0.0',
      description: `
        ## 🚗 VinFast API Documentation

        API documentation cho website cửa hàng ô tô VinFast - Hệ thống quản lý bán hàng và dịch vụ ô tô điện.

        ### 🔐 Authentication
        API sử dụng JWT (JSON Web Token) để xác thực. Để sử dụng các endpoint được bảo vệ:
        1. Đăng nhập qua \`/api/auth/login\` để lấy token
        2. Thêm token vào header: \`Authorization: Bearer <token>\`

        ### 📱 Features
        - **Authentication & Authorization**: Đăng ký, đăng nhập, quản lý người dùng
        - **Car Management**: Quản lý xe, tìm kiếm, lọc theo loại
        - **Order Management**: Đặt hàng, theo dõi đơn hàng, thanh toán
        - **Test Drive**: Đăng ký lái thử, quản lý lịch hẹn
        - **Contact**: Hệ thống liên hệ tư vấn
        - **News**: Quản lý tin tức, bài viết
        - **User Management**: Quản lý người dùng (Admin)

        ### 🌐 Base URL
        - Development: \`http://localhost:8000/api\`
        - Production: \`https://api.vinfast.com/api\`
      `,
      contact: {
        name: 'VinFast Development Team',
        email: 'dev@vinfast.com',
        url: 'https://vinfast.vn'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'API xác thực và quản lý phiên đăng nhập'
      },
      {
        name: 'Cars',
        description: 'API quản lý xe - xem, tìm kiếm, quản lý (Admin)'
      },
      {
        name: 'Orders',
        description: 'API quản lý đơn hàng - đặt cọc, theo dõi trạng thái'
      },
      {
        name: 'Test Drive',
        description: 'API đăng ký và quản lý lịch lái thử xe'
      },
      {
        name: 'Contact',
        description: 'API liên hệ tư vấn và hỗ trợ khách hàng'
      },
      {
        name: 'News',
        description: 'API quản lý tin tức và bài viết'
      },
      {
        name: 'Users',
        description: 'API quản lý người dùng (Admin only)'
      }
    ],
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.vinfast.com' 
          : `http://localhost:${process.env.PORT || 8000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token để xác thực. Format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'phone'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID người dùng'
            },
            name: {
              type: 'string',
              description: 'Họ tên',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email',
              example: 'user@example.com'
            },
            phone: {
              type: 'string',
              description: 'Số điện thoại',
              example: '0123456789'
            },
            address: {
              type: 'string',
              description: 'Địa chỉ',
              example: 'Hà Nội'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Vai trò',
              example: 'user'
            },
            isActive: {
              type: 'boolean',
              description: 'Trạng thái hoạt động',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày tạo'
            }
          }
        },
        Car: {
          type: 'object',
          required: ['name', 'type', 'price', 'year', 'description'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID xe'
            },
            name: {
              type: 'string',
              description: 'Tên xe',
              example: 'VinFast VF 8'
            },
            slug: {
              type: 'string',
              description: 'Slug URL',
              example: 'vinfast-vf-8'
            },
            type: {
              type: 'string',
              enum: ['sedan', 'suv', 'electric'],
              description: 'Loại xe',
              example: 'electric'
            },
            price: {
              type: 'number',
              description: 'Giá xe (VND)',
              example: 1200000000
            },
            year: {
              type: 'number',
              description: 'Năm sản xuất',
              example: 2024
            },
            description: {
              type: 'string',
              description: 'Mô tả xe'
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  alt: { type: 'string' },
                  isPrimary: { type: 'boolean' }
                }
              }
            },
            specifications: {
              type: 'object',
              properties: {
                engine: { type: 'string' },
                power: { type: 'string' },
                transmission: { type: 'string' },
                fuelType: { type: 'string' },
                seating: { type: 'number' }
              }
            },
            isElectric: {
              type: 'boolean',
              description: 'Xe điện',
              example: true
            },
            isFeatured: {
              type: 'boolean',
              description: 'Xe nổi bật',
              example: true
            },
            stock: {
              type: 'number',
              description: 'Số lượng tồn kho',
              example: 10
            }
          }
        },
        Order: {
          type: 'object',
          required: ['items', 'customerInfo', 'payment'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID đơn hàng'
            },
            orderNumber: {
              type: 'string',
              description: 'Mã đơn hàng',
              example: 'VF20241201001'
            },
            user: {
              type: 'string',
              description: 'ID người dùng'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  car: { type: 'string' },
                  quantity: { type: 'number' },
                  selectedColor: { type: 'string' },
                  depositAmount: { type: 'number' },
                  unitPrice: { type: 'number' }
                }
              }
            },
            customerInfo: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                address: { type: 'string' },
                city: { type: 'string' }
              }
            },
            payment: {
              type: 'object',
              properties: {
                method: {
                  type: 'string',
                  enum: ['bank_transfer', 'credit_card', 'cash']
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'completed', 'failed', 'refunded']
                },
                amount: { type: 'number' }
              }
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
              example: 'pending'
            },
            totalAmount: {
              type: 'number',
              description: 'Tổng tiền',
              example: 100000000
            }
          }
        },
        TestDrive: {
          type: 'object',
          required: ['car', 'customerInfo', 'schedule', 'location'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID lịch lái thử'
            },
            car: {
              type: 'string',
              description: 'ID xe'
            },
            customerInfo: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' }
              }
            },
            schedule: {
              type: 'object',
              properties: {
                preferredDate: {
                  type: 'string',
                  format: 'date',
                  description: 'Ngày mong muốn'
                },
                preferredTime: {
                  type: 'string',
                  enum: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
                  description: 'Giờ mong muốn'
                }
              }
            },
            location: {
              type: 'string',
              enum: ['hanoi', 'hcm', 'danang', 'haiphong', 'cantho'],
              description: 'Địa điểm lái thử'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
              example: 'pending'
            }
          }
        },
        Contact: {
          type: 'object',
          required: ['name', 'email', 'phone', 'subject', 'message'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID liên hệ'
            },
            name: {
              type: 'string',
              description: 'Họ tên',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email'
            },
            phone: {
              type: 'string',
              description: 'Số điện thoại'
            },
            subject: {
              type: 'string',
              enum: ['product-inquiry', 'test-drive', 'purchase', 'service', 'warranty', 'other'],
              description: 'Chủ đề'
            },
            message: {
              type: 'string',
              description: 'Nội dung tin nhắn'
            },
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'resolved', 'closed'],
              example: 'new'
            }
          }
        },
        News: {
          type: 'object',
          required: ['title', 'excerpt', 'content', 'category', 'featuredImage'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID bài viết'
            },
            title: {
              type: 'string',
              description: 'Tiêu đề'
            },
            slug: {
              type: 'string',
              description: 'Slug URL'
            },
            excerpt: {
              type: 'string',
              description: 'Tóm tắt'
            },
            content: {
              type: 'string',
              description: 'Nội dung'
            },
            category: {
              type: 'string',
              enum: ['product', 'technology', 'business', 'event', 'announcement', 'review'],
              description: 'Danh mục'
            },
            featuredImage: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                alt: { type: 'string' }
              }
            },
            status: {
              type: 'string',
              enum: ['draft', 'published', 'archived'],
              example: 'published'
            },
            featured: {
              type: 'boolean',
              description: 'Tin tức nổi bật'
            },
            views: {
              type: 'number',
              description: 'Lượt xem'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Thông báo lỗi'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Chi tiết lỗi validation'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Thông báo thành công',
              example: 'Thành công'
            },
            data: {
              type: 'object',
              description: 'Dữ liệu trả về'
            },
            count: {
              type: 'number',
              description: 'Số lượng items trong trang hiện tại',
              example: 10
            },
            total: {
              type: 'number',
              description: 'Tổng số items',
              example: 100
            },
            pagination: {
              type: 'object',
              properties: {
                next: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', example: 2 },
                    limit: { type: 'number', example: 10 }
                  }
                },
                prev: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', example: 1 },
                    limit: { type: 'number', example: 10 }
                  }
                }
              }
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Đăng nhập thành công'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Dữ liệu không hợp lệ'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'field' },
                  value: { type: 'string', example: 'invalid_value' },
                  msg: { type: 'string', example: 'Email không hợp lệ' },
                  path: { type: 'string', example: 'email' },
                  location: { type: 'string', example: 'body' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
