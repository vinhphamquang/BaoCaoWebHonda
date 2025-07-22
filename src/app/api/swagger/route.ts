import { NextResponse } from 'next/server';

// Static Swagger specification
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Honda Plus API',
    version: '1.0.0',
    description: 'API documentation for Honda Plus - Premium Honda dealership platform',
    contact: {
      name: 'Honda Plus Support',
      email: 'support@hondaplus.vn',
      url: 'https://hondaplus.vn'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://hondaplus.vn/api' 
        : 'http://localhost:3001/api',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
    }
  ],
  components: {
    schemas: {
      Car: {
        type: 'object',
        required: ['name', 'model', 'price', 'category', 'year'],
        properties: {
          _id: {
            type: 'string',
            description: 'Unique identifier for the car',
            example: '507f1f77bcf86cd799439011'
          },
          name: {
            type: 'string',
            description: 'Full name of the car',
            example: 'Honda Civic 2024'
          },
          model: {
            type: 'string',
            description: 'Car model',
            example: 'Civic'
          },
          price: {
            type: 'number',
            description: 'Price in VND',
            example: 730000000
          },
          category: {
            type: 'string',
            enum: ['sedan', 'suv', 'hatchback', 'coupe'],
            description: 'Car category',
            example: 'sedan'
          },
          year: {
            type: 'number',
            description: 'Manufacturing year',
            example: 2024
          },
          color: {
            type: 'string',
            description: 'Car color',
            example: 'Trắng Ngọc Trai'
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of image URLs',
            example: ['/images/honda-civic-2024.jpg']
          },
          specifications: {
            type: 'object',
            properties: {
              engine: {
                type: 'string',
                example: '1.5L VTEC Turbo'
              },
              transmission: {
                type: 'string',
                example: 'CVT'
              },
              fuelType: {
                type: 'string',
                example: 'Xăng'
              },
              seating: {
                type: 'number',
                example: 5
              },
              mileage: {
                type: 'string',
                example: '6.5L/100km'
              },
              safety: {
                type: 'array',
                items: {
                  type: 'string'
                },
                example: ['Honda SENSING', '6 túi khí']
              },
              features: {
                type: 'array',
                items: {
                  type: 'string'
                },
                example: ['Màn hình cảm ứng', 'Apple CarPlay']
              }
            }
          },
          description: {
            type: 'string',
            description: 'Detailed description of the car'
          },
          isAvailable: {
            type: 'boolean',
            description: 'Availability status',
            example: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      Order: {
        type: 'object',
        required: ['customerName', 'customerEmail', 'customerPhone', 'carId', 'totalAmount'],
        properties: {
          _id: {
            type: 'string',
            description: 'Unique identifier for the order',
            example: '507f1f77bcf86cd799439012'
          },
          customerName: {
            type: 'string',
            description: 'Customer full name',
            example: 'Nguyễn Văn A'
          },
          customerEmail: {
            type: 'string',
            format: 'email',
            description: 'Customer email address',
            example: 'nguyenvana@email.com'
          },
          customerPhone: {
            type: 'string',
            description: 'Customer phone number',
            example: '0901234567'
          },
          customerAddress: {
            type: 'string',
            description: 'Customer address',
            example: '123 Đường ABC, Quận 1, TP.HCM'
          },
          carId: {
            type: 'string',
            description: 'ID of the ordered car',
            example: '507f1f77bcf86cd799439011'
          },
          car: {
            $ref: '#/components/schemas/Car',
            description: 'Car details (populated)'
          },
          quantity: {
            type: 'number',
            description: 'Number of cars ordered',
            example: 1,
            default: 1
          },
          totalAmount: {
            type: 'number',
            description: 'Total order amount in VND',
            example: 730000000
          },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
            description: 'Order status',
            example: 'pending',
            default: 'pending'
          },
          paymentMethod: {
            type: 'string',
            enum: ['cash', 'bank_transfer', 'credit_card', 'installment'],
            description: 'Payment method',
            example: 'bank_transfer'
          },
          paymentStatus: {
            type: 'string',
            enum: ['pending', 'paid', 'failed', 'refunded'],
            description: 'Payment status',
            example: 'pending',
            default: 'pending'
          },
          notes: {
            type: 'string',
            description: 'Additional notes for the order',
            example: 'Khách hàng muốn giao xe vào cuối tuần'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Order creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['customerName', 'customerEmail', 'customerPhone', 'carId'],
        properties: {
          customerName: {
            type: 'string',
            description: 'Customer full name',
            example: 'Nguyễn Văn A'
          },
          customerEmail: {
            type: 'string',
            format: 'email',
            description: 'Customer email address',
            example: 'nguyenvana@email.com'
          },
          customerPhone: {
            type: 'string',
            description: 'Customer phone number',
            example: '0901234567'
          },
          customerAddress: {
            type: 'string',
            description: 'Customer address',
            example: '123 Đường ABC, Quận 1, TP.HCM'
          },
          carId: {
            type: 'string',
            description: 'ID of the car to order',
            example: '507f1f77bcf86cd799439011'
          },
          quantity: {
            type: 'number',
            description: 'Number of cars to order',
            example: 1,
            default: 1,
            minimum: 1
          },
          paymentMethod: {
            type: 'string',
            enum: ['cash', 'bank_transfer', 'credit_card', 'installment'],
            description: 'Preferred payment method',
            example: 'bank_transfer'
          },
          notes: {
            type: 'string',
            description: 'Additional notes for the order',
            example: 'Khách hàng muốn giao xe vào cuối tuần'
          }
        }
      },
      SeedResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Database seeded successfully'
          },
          data: {
            type: 'object',
            properties: {
              carsCreated: {
                type: 'number',
                example: 12
              },
              existingCars: {
                type: 'number',
                example: 0
              }
            }
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful'
          },
          message: {
            type: 'string',
            description: 'Response message'
          },
          data: {
            description: 'Response data'
          },
          error: {
            type: 'string',
            description: 'Error message if request failed'
          }
        }
      }
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Resource not found',
              error: 'The requested resource could not be found'
            }
          }
        }
      },
      BadRequest: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Bad request',
              error: 'Invalid request parameters'
            }
          }
        }
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Internal server error',
              error: 'An unexpected error occurred'
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Health',
      description: 'API health check endpoints'
    },
    {
      name: 'Cars',
      description: 'Honda car management endpoints'
    },
    {
      name: 'Orders',
      description: 'Order management endpoints'
    },
    {
      name: 'Database',
      description: 'Database seeding and management'
    }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'API Health Check',
        description: 'Check if the Honda Plus API is running and healthy',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Honda Plus API is healthy'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time'
                    },
                    version: {
                      type: 'string',
                      example: '1.0.0'
                    },
                    uptime: {
                      type: 'number',
                      description: 'Server uptime in seconds'
                    },
                    environment: {
                      type: 'string',
                      example: 'production'
                    },
                    database: {
                      type: 'object',
                      properties: {
                        status: {
                          type: 'string',
                          example: 'connected'
                        },
                        responseTime: {
                          type: 'number',
                          description: 'Database response time in ms'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '503': {
            description: 'API is unhealthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    message: {
                      type: 'string',
                      example: 'Honda Plus API is unhealthy'
                    },
                    error: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/cars': {
      get: {
        tags: ['Cars'],
        summary: 'Get all Honda cars',
        description: 'Retrieve a list of Honda cars with optional filtering, sorting, and pagination',
        parameters: [
          {
            in: 'query',
            name: 'search',
            schema: {
              type: 'string'
            },
            description: 'Search term for car name or model'
          },
          {
            in: 'query',
            name: 'model',
            schema: {
              type: 'string'
            },
            description: 'Filter by car model (Civic, Accord, CR-V, etc.)'
          },
          {
            in: 'query',
            name: 'category',
            schema: {
              type: 'string',
              enum: ['sedan', 'suv', 'hatchback', 'coupe']
            },
            description: 'Filter by car category'
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
              enum: ['name', 'price', 'year', 'createdAt'],
              default: 'createdAt'
            },
            description: 'Field to sort by'
          },
          {
            in: 'query',
            name: 'sortOrder',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc'
            },
            description: 'Sort order'
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'number',
              default: 10
            },
            description: 'Number of results to return'
          }
        ],
        responses: {
          '200': {
            description: 'Successfully retrieved cars',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Car'
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },
    '/api/cars/{id}': {
      get: {
        tags: ['Cars'],
        summary: 'Get car by ID',
        description: 'Retrieve a specific Honda car by its unique identifier',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string'
            },
            description: 'Car ID',
            example: '507f1f77bcf86cd799439011'
          }
        ],
        responses: {
          '200': {
            description: 'Successfully retrieved car',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Car'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '404': {
            $ref: '#/components/responses/NotFound'
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        description: 'Retrieve a list of all orders with optional filtering and pagination',
        parameters: [
          {
            in: 'query',
            name: 'status',
            schema: {
              type: 'string',
              enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled']
            },
            description: 'Filter by order status'
          },
          {
            in: 'query',
            name: 'customerEmail',
            schema: {
              type: 'string'
            },
            description: 'Filter by customer email'
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
              enum: ['createdAt', 'totalAmount', 'customerName'],
              default: 'createdAt'
            },
            description: 'Field to sort by'
          },
          {
            in: 'query',
            name: 'sortOrder',
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc'
            },
            description: 'Sort order'
          },
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'number',
              default: 10
            },
            description: 'Number of results to return'
          },
          {
            in: 'query',
            name: 'page',
            schema: {
              type: 'number',
              default: 1
            },
            description: 'Page number for pagination'
          }
        ],
        responses: {
          '200': {
            description: 'Successfully retrieved orders',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Order'
                          }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            total: {
                              type: 'number'
                            },
                            page: {
                              type: 'number'
                            },
                            limit: {
                              type: 'number'
                            },
                            totalPages: {
                              type: 'number'
                            }
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Create new order',
        description: 'Create a new car order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateOrderRequest'
              },
              example: {
                customerName: 'Nguyễn Văn A',
                customerEmail: 'nguyenvana@email.com',
                customerPhone: '0901234567',
                customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
                carId: '507f1f77bcf86cd799439011',
                quantity: 1,
                paymentMethod: 'bank_transfer',
                notes: 'Khách hàng muốn giao xe vào cuối tuần'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/ApiResponse'
                    },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Order'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '404': {
            description: 'Car not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  message: 'Car not found',
                  error: 'The specified car does not exist'
                }
              }
            }
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },
    '/api/seed': {
      post: {
        tags: ['Database'],
        summary: 'Seed database',
        description: 'Populate the database with sample Honda car data for development and testing',
        responses: {
          '200': {
            description: 'Database seeded successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SeedResponse'
                },
                example: {
                  success: true,
                  message: 'Database seeded successfully',
                  data: {
                    carsCreated: 12,
                    existingCars: 0
                  }
                }
              }
            }
          },
          '500': {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    }
  }
};

export async function GET() {
  return NextResponse.json(swaggerSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
}
