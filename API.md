# 🚗 Honda Plus API Documentation

Complete API reference for Honda Plus - Premium Honda dealership platform.

## 📋 Table of Contents

- [🔗 Base URLs](#base-urls)
- [🔑 Authentication](#authentication)
- [📊 API Endpoints](#api-endpoints)
- [📝 Data Models](#data-models)
- [🧪 Testing](#testing)
- [📖 Interactive Documentation](#interactive-documentation)

## 🔗 Base URLs

| Environment | URL |
|-------------|-----|
| **Development** | `http://localhost:3001/api` |
| **Staging** | `https://staging.hondaplus.vn/api` |
| **Production** | `https://hondaplus.vn/api` |

## 🔑 Authentication

Currently, the API is open for public access. Authentication will be implemented in future versions.

## 📊 API Endpoints

### 🏥 Health Check

#### `GET /api/health`
Check if the Honda Plus API is running and healthy.

**Response:**
```json
{
  "success": true,
  "message": "Honda Plus API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "environment": "production",
  "database": {
    "status": "connected",
    "responseTime": 25
  },
  "memory": {
    "used": 45,
    "total": 128,
    "external": 12
  }
}
```

### 🚗 Cars API

#### `GET /api/cars`
Retrieve a list of Honda cars with optional filtering, sorting, and pagination.

**Query Parameters:**
- `search` (string) - Search term for car name or model
- `model` (string) - Filter by car model (Civic, Accord, CR-V, etc.)
- `category` (string) - Filter by category (sedan, suv, hatchback, coupe)
- `color` (string) - Filter by car color
- `minPrice` (number) - Minimum price filter (in VND)
- `maxPrice` (number) - Maximum price filter (in VND)
- `minYear` (number) - Minimum manufacturing year
- `maxYear` (number) - Maximum manufacturing year
- `sortBy` (string) - Sort field (name, price, year, createdAt) - Default: `createdAt`
- `sortOrder` (string) - Sort order (asc, desc) - Default: `desc`
- `limit` (number) - Number of results to return - Default: `10`
- `page` (number) - Page number for pagination - Default: `1`

**Example URLs:**
```
GET /api/cars?limit=10&sortBy=price&sortOrder=asc
GET /api/cars?search=civic&category=sedan
GET /api/cars?model=Civic&minPrice=500000000&maxPrice=1000000000
GET /api/cars?minYear=2023&maxYear=2024
```

#### `GET /api/cars/{id}`
Get a specific Honda car by its unique identifier.

**Path Parameters:**
- `id` (string, required) - Car unique identifier (MongoDB ObjectId)

**Example:**
```
GET /api/cars/507f1f77bcf86cd799439011
```

### 📋 Orders API

#### `GET /api/orders`
Retrieve a list of all orders with optional filtering and pagination.

**Query Parameters:**
- `status` (string) - Filter by order status (pending, confirmed, processing, completed, cancelled)
- `customerEmail` (string) - Filter by customer email
- `sortBy` (string) - Sort field (createdAt, totalAmount, customerName) - Default: `createdAt`
- `sortOrder` (string) - Sort order (asc, desc) - Default: `desc`
- `limit` (number) - Number of results to return - Default: `10`
- `page` (number) - Page number for pagination - Default: `1`

**Example URLs:**
```
GET /api/orders?status=pending&limit=20
GET /api/orders?customerEmail=customer@email.com
GET /api/orders?sortBy=totalAmount&sortOrder=desc
```

#### `POST /api/orders`
Create a new car order.

**Request Body:**
```json
{
  "customerName": "Nguyễn Văn A",
  "customerEmail": "nguyenvana@email.com",
  "customerPhone": "0901234567",
  "customerAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "carId": "507f1f77bcf86cd799439011",
  "quantity": 1,
  "paymentMethod": "bank_transfer",
  "notes": "Khách hàng muốn giao xe vào cuối tuần"
}
```

**Required Fields:**
- `customerName` (string) - Customer full name
- `customerEmail` (string) - Customer email address
- `customerPhone` (string) - Customer phone number
- `carId` (string) - ID of the car to order

**Optional Fields:**
- `customerAddress` (string) - Customer address
- `quantity` (number) - Number of cars to order (default: 1)
- `paymentMethod` (string) - Payment method (cash, bank_transfer, credit_card, installment)
- `notes` (string) - Additional notes for the order

### 🗄️ Database API

#### `POST /api/seed`
Populate the database with sample Honda car data for development and testing.

**⚠️ Development Only:** This endpoint should only be used in development environment.

**Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "data": {
    "carsCreated": 12,
    "existingCars": 0
  }
}
```

## 📝 Data Models

### Car Model
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Honda Civic 2024",
  "model": "Civic",
  "price": 730000000,
  "category": "sedan",
  "year": 2024,
  "color": "Trắng Ngọc Trai",
  "images": ["/images/honda-civic-2024.jpg"],
  "specifications": {
    "engine": "1.5L VTEC Turbo",
    "transmission": "CVT",
    "fuelType": "Xăng",
    "seating": 5,
    "mileage": "6.5L/100km",
    "safety": ["Honda SENSING", "6 túi khí"],
    "features": ["Màn hình cảm ứng", "Apple CarPlay"]
  },
  "description": "Honda Civic 2024 - Xe Honda chính hãng với thiết kế hiện đại",
  "isAvailable": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Order Model
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "customerName": "Nguyễn Văn A",
  "customerEmail": "nguyenvana@email.com",
  "customerPhone": "0901234567",
  "customerAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "carId": "507f1f77bcf86cd799439011",
  "car": { /* Car object */ },
  "quantity": 1,
  "totalAmount": 730000000,
  "status": "pending",
  "paymentMethod": "bank_transfer",
  "paymentStatus": "pending",
  "notes": "Khách hàng muốn giao xe vào cuối tuần",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### API Response Format
```json
{
  "success": true,
  "message": "Request successful",
  "data": { /* Response data */ },
  "pagination": { /* Pagination info for list endpoints */ }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

## 🧪 Testing

### Postman Collection
Import the Postman collection for easy API testing:
- Collection: `postman/Honda-Plus-API.postman_collection.json`
- Environment: `postman/Honda-Plus-Environment.postman_environment.json`

### CLI Testing
```bash
# Run all API tests
npm run postman:test

# Run specific test
newman run postman/Honda-Plus-API.postman_collection.json \
  -e postman/Honda-Plus-Environment.postman_environment.json \
  --folder "Cars"
```

### Manual Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Get cars
curl "http://localhost:3001/api/cars?limit=5"

# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test User","customerEmail":"test@email.com","customerPhone":"0901234567","carId":"CAR_ID_HERE"}'
```

## 📖 Interactive Documentation

### Swagger UI
Access interactive API documentation:
- **Local**: http://localhost:3001/api/docs
- **OpenAPI Spec**: http://localhost:3001/api/swagger

### Features
- ✅ Interactive endpoint testing
- ✅ Complete schema documentation
- ✅ Example requests and responses
- ✅ Error code explanations
- ✅ Model definitions

## 📞 Support

For API support and questions:
- 📧 Email: api-support@hondaplus.vn
- 📖 Documentation: `/api/docs`
- 🐛 Issues: GitHub Issues
- 💬 Slack: #honda-plus-api

---

**Honda Plus API** - *Professional, Scalable, Production-Ready* 🚗📖✨
