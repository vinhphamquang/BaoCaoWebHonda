# 🚀 MongoDB Atlas API Guide - Honda Plus

Hướng dẫn chi tiết về API lấy mẫu xe từ MongoDB Atlas đã được tối ưu hóa.

## 📋 Tổng quan

API Honda Plus đã được nâng cấp với các tính năng tối ưu cho MongoDB Atlas:

- ✅ **Aggregation Pipeline** - Tối ưu hiệu suất truy vấn
- ✅ **Text Search** - Tìm kiếm toàn văn với scoring
- ✅ **Connection Pooling** - Quản lý kết nối hiệu quả
- ✅ **Error Handling** - Xử lý lỗi chi tiết cho Atlas
- ✅ **Performance Monitoring** - Theo dõi hiệu suất
- ✅ **Advanced Indexing** - Index tối ưu cho các query phổ biến

## 🔗 Endpoints Mới

### 1. GET /api/cars - Lấy danh sách xe (Đã tối ưu)

**Cải tiến:**
- Sử dụng MongoDB Aggregation Pipeline
- Validation tham số đầu vào
- Text search với fallback regex
- Metadata về performance

**Ví dụ:**
```bash
# Tìm kiếm cơ bản
GET /api/cars?search=civic&limit=10

# Lọc nâng cao
GET /api/cars?category=sedan&minPrice=500000000&maxPrice=1000000000&sortBy=price&sortOrder=asc

# Lọc theo thông số kỹ thuật
GET /api/cars?seating=5&fuelType=xăng&transmission=cvt
```

**Response mới:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "metadata": {
    "executionTime": 1640995200000,
    "filtersApplied": 3,
    "searchTerms": 2
  }
}
```

### 2. GET /api/cars/stats - Thống kê xe

**Mô tả:** Lấy thống kê tổng quan về xe trong hệ thống

**Ví dụ:**
```bash
GET /api/cars/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCars": 50,
      "avgPrice": 750000000,
      "minPrice": 500000000,
      "maxPrice": 1500000000,
      "avgYear": 2023,
      "minYear": 2020,
      "maxYear": 2024
    },
    "categories": [
      {
        "_id": "sedan",
        "count": 20,
        "avgPrice": 700000000,
        "minPrice": 500000000,
        "maxPrice": 1000000000
      }
    ],
    "models": [
      {
        "_id": "Civic",
        "count": 8,
        "avgPrice": 730000000,
        "years": [2023, 2024]
      }
    ],
    "years": [...],
    "seating": [...],
    "fuelTypes": [...],
    "colors": [...]
  }
}
```

### 3. GET /api/cars/search - Tìm kiếm nhanh

**Mô tả:** Tìm kiếm xe với text search tối ưu

**Ví dụ:**
```bash
GET /api/cars/search?q=honda civic&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "_id": "...",
        "name": "Honda Civic 2024",
        "model": "Civic",
        "price": 730000000,
        "year": 2024,
        "category": "sedan",
        "color": "Trắng Ngọc Trai",
        "images": ["/images/honda-civic-2024.jpg"],
        "specifications": {
          "engine": "1.5L VTEC Turbo",
          "transmission": "CVT",
          "fuelType": "Xăng",
          "seating": 5
        }
      }
    ],
    "query": "honda civic",
    "total": 3,
    "suggestions": [],
    "searchType": "text"
  }
}
```

### 4. POST /api/cars/search - Tìm kiếm nâng cao

**Mô tả:** Tìm kiếm với filters phức tạp

**Request Body:**
```json
{
  "query": "honda",
  "filters": {
    "priceRange": {
      "min": 500000000,
      "max": 1000000000
    },
    "yearRange": {
      "min": 2023,
      "max": 2024
    },
    "categories": ["sedan", "suv"],
    "models": ["Civic", "CR-V"],
    "colors": ["Trắng Ngọc Trai", "Đen Ánh Kim"],
    "seating": [5, 7],
    "fuelTypes": ["Xăng", "Hybrid"]
  },
  "sort": {
    "field": "price",
    "order": "asc"
  },
  "limit": 20,
  "page": 1
}
```

## 🔧 Cấu hình MongoDB Atlas

### Connection String
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Tối ưu Connection
```typescript
const opts = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0,
  compressors: ['snappy', 'zlib'],
  readPreference: 'secondaryPreferred',
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  },
  retryWrites: true,
  retryReads: true
};
```

## 📊 Indexes Tối ưu

### Text Search Index
```javascript
{
  name: 'text',
  model: 'text',
  description: 'text',
  'specifications.engine': 'text',
  'specifications.features': 'text'
}
```

### Compound Indexes
```javascript
// Cho filtering phổ biến
{ isAvailable: 1, category: 1, price: 1 }
{ isAvailable: 1, model: 1, year: -1 }
{ isAvailable: 1, price: 1, year: -1 }
{ isAvailable: 1, 'specifications.seating': 1 }

// Cho sorting
{ createdAt: -1 }
{ updatedAt: -1 }
{ category: 1 }
```

## 🚀 Performance Tips

### 1. Sử dụng Aggregation Pipeline
```typescript
// Thay vì multiple queries
const cars = await Car.find(filter);
const total = await Car.countDocuments(filter);

// Sử dụng single aggregation
const [result] = await Car.aggregate([
  { $match: filter },
  {
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: "count" }]
    }
  }
]);
```

### 2. Projection để giảm bandwidth
```typescript
// Chỉ lấy fields cần thiết
.select('name model price year category color images.0')
```

### 3. Lean queries cho read-only
```typescript
// Tăng tốc độ query
.lean()
```

## 🔍 Monitoring & Debugging

### Health Check
```bash
GET /api/health
```

Response bao gồm thông tin MongoDB Atlas:
```json
{
  "database": {
    "status": "connected",
    "responseTime": 25,
    "readyState": 1,
    "host": "cluster.mongodb.net",
    "name": "honda_plus"
  }
}
```

### Error Handling
- `MongoNetworkError` → 503 Service Unavailable
- `MongoParseError` → 500 Internal Server Error
- `ValidationError` → 400 Bad Request
- Duplicate key → 409 Conflict

## 🧪 Testing

### Postman Collection
Cập nhật collection với các endpoints mới:

```bash
# Test basic search
GET {{baseUrl}}/api/cars?search=civic&limit=5

# Test stats
GET {{baseUrl}}/api/cars/stats

# Test quick search
GET {{baseUrl}}/api/cars/search?q=honda&limit=10

# Test advanced search
POST {{baseUrl}}/api/cars/search
Content-Type: application/json
{
  "query": "honda",
  "filters": {
    "priceRange": {"min": 500000000, "max": 1000000000}
  }
}
```

### Performance Testing
```bash
# Load test với nhiều concurrent requests
ab -n 1000 -c 10 http://localhost:3001/api/cars

# Memory usage monitoring
GET /api/health
```

## 📈 Best Practices

### 1. Query Optimization
- Sử dụng indexes phù hợp
- Limit kết quả trả về
- Projection chỉ fields cần thiết
- Sử dụng aggregation cho complex queries

### 2. Connection Management
- Connection pooling
- Proper error handling
- Retry logic cho network errors
- Monitor connection health

### 3. Security
- Validate input parameters
- Sanitize search queries
- Rate limiting
- Authentication cho admin endpoints

### 4. Caching
- Cache static data (stats, categories)
- Redis cho session management
- CDN cho images
- Browser caching headers

## 🔧 Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```
   Error: MongoNetworkError
   Solution: Check network, increase timeout, verify Atlas whitelist
   ```

2. **Slow Queries**
   ```
   Solution: Add appropriate indexes, use explain() to analyze
   ```

3. **Memory Issues**
   ```
   Solution: Use lean(), limit results, implement pagination
   ```

4. **Text Search Not Working**
   ```
   Solution: Create text index, fallback to regex search
   ```

---

**Honda Plus MongoDB Atlas API** - *Optimized, Scalable, Production-Ready* 🚗⚡📊