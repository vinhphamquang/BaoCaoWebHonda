# 📮 Postman Collection Guide

## 🌟 Tổng quan

Postman Collection cho VinFast API cung cấp một bộ test cases hoàn chỉnh để test tất cả API endpoints một cách dễ dàng và có tổ chức.

## 📁 Files

- `VinFast-API.postman_collection.json` - Collection chính với tất cả API endpoints
- `VinFast-API.postman_environment.json` - Environment variables
- `postman-guide.md` - Hướng dẫn sử dụng (file này)

## 🚀 Cài đặt

### 1. Import Collection

1. Mở Postman
2. Click **Import** button
3. Chọn file `VinFast-API.postman_collection.json`
4. Collection sẽ xuất hiện trong sidebar

### 2. Import Environment

1. Click **Import** button
2. Chọn file `VinFast-API.postman_environment.json`
3. Chọn environment "VinFast API Environment" từ dropdown

### 3. Cấu hình Base URL

Environment đã được cấu hình sẵn với:
- **Development**: `http://localhost:8000/api`
- **Production**: Thay đổi `baseUrl` trong environment

## 🔐 Authentication Flow

### Bước 1: Đăng nhập Admin
```
POST {{baseUrl}}/auth/login
{
  "email": "admin@vinfast.com",
  "password": "admin123"
}
```

**Kết quả**: Token sẽ tự động được lưu vào `authToken` variable

### Bước 2: Test Protected Endpoints
Tất cả requests có 🔒 icon sẽ tự động sử dụng `authToken`

## 📋 Test Scenarios

### 🎯 Scenario 1: Complete User Journey

1. **Register new user** → `🔐 Authentication/Register User`
2. **Login** → `🔐 Authentication/Login User`
3. **Browse cars** → `🚗 Cars/Get All Cars`
4. **View car details** → `🚗 Cars/Get Car by ID`
5. **Register test drive** → `🚙 Test Drive/Register Test Drive`
6. **Create order** → `📦 Orders/Create Order`
7. **Check order status** → `📦 Orders/Get Order by ID`

### 🎯 Scenario 2: Admin Management

1. **Login as admin** → `🔐 Authentication/Login Admin`
2. **Create new car** → `🚗 Cars/Create Car (Admin)`
3. **View all orders** → `📦 Orders/Get All Orders (Admin)`
4. **Update order status** → `📦 Orders/Update Order Status (Admin)`
5. **Manage contacts** → `📞 Contact/Get All Contacts (Admin)`
6. **Create news** → `📰 News/Create News (Admin)`

### 🎯 Scenario 3: Public API Testing

1. **Get featured cars** → `🚗 Cars/Get Featured Cars`
2. **Search cars** → `🚗 Cars/Search Cars`
3. **Get news** → `📰 News/Get All News`
4. **Send contact** → `📞 Contact/Send Contact`
5. **Check available slots** → `🚙 Test Drive/Get Available Slots`

## 🔧 Advanced Features

### Auto-Generated Variables

Collection tự động lưu các ID quan trọng:
- `carId` - Từ car details response
- `orderId` - Từ create order response
- `testDriveId` - Từ test drive registration
- `contactId` - Từ contact submission
- `newsId` - Từ news details

### Pre-request Scripts

- Tự động set base URL nếu chưa có
- Log request information
- Validate environment setup

### Test Scripts

- Tự động lưu tokens và IDs
- Validate response status codes
- Log success/error messages
- Check authentication status

## 📊 Collection Structure

```
📮 VinFast API Collection
├── 🔐 Authentication (6 requests)
│   ├── Register User
│   ├── Login Admin (saves authToken)
│   ├── Login User (saves userToken)
│   ├── Get My Profile
│   ├── Update Profile
│   └── Logout
├── 🚗 Cars (8 requests)
│   ├── Get All Cars
│   ├── Get Featured Cars
│   ├── Search Cars
│   ├── Get Car by ID (saves carId)
│   ├── Create Car (Admin)
│   ├── Update Car (Admin)
│   └── Delete Car (Admin)
├── 📦 Orders (5 requests)
│   ├── Get My Orders
│   ├── Create Order (saves orderId)
│   ├── Get Order by ID
│   ├── Get All Orders (Admin)
│   └── Update Order Status (Admin)
├── 🚙 Test Drive (6 requests)
│   ├── Get Available Slots
│   ├── Register Test Drive (saves testDriveId)
│   ├── Get My Test Drives
│   ├── Get Test Drive by ID
│   ├── Update Test Drive Status (Admin)
│   └── Add Feedback
├── 📞 Contact (4 requests)
│   ├── Send Contact (saves contactId)
│   ├── Get All Contacts (Admin)
│   ├── Get Contact by ID (Admin)
│   └── Respond to Contact (Admin)
└── 📰 News (6 requests)
    ├── Get All News
    ├── Get Featured News
    ├── Search News
    ├── Get News by Slug (saves newsId)
    ├── Create News (Admin)
    └── Add Comment to News
```

## 🧪 Testing Tips

### 1. **Run Collection**
- Click "..." next to collection name
- Select "Run collection"
- Choose requests to run
- Set iterations and delay

### 2. **Environment Switching**
```javascript
// Switch to production
pm.environment.set('baseUrl', 'https://api.vinfast.com/api');

// Switch back to development
pm.environment.set('baseUrl', 'http://localhost:8000/api');
```

### 3. **Bulk Testing**
```javascript
// In Tests tab
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has data", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('data');
});
```

### 4. **Data Validation**
```javascript
// Validate car data structure
pm.test("Car has required fields", function () {
    const car = pm.response.json().data;
    pm.expect(car).to.have.property('name');
    pm.expect(car).to.have.property('price');
    pm.expect(car).to.have.property('type');
});
```

## 🔍 Debugging

### Common Issues

1. **401 Unauthorized**
   - Check if token is saved in environment
   - Re-login to get fresh token
   - Verify token format: `Bearer <token>`

2. **404 Not Found**
   - Check if server is running
   - Verify base URL in environment
   - Check endpoint path

3. **400 Bad Request**
   - Validate request body format
   - Check required fields
   - Verify data types

### Debug Scripts

```javascript
// Log all environment variables
console.log('Environment variables:');
Object.keys(pm.environment.toObject()).forEach(key => {
    console.log(`${key}: ${pm.environment.get(key)}`);
});

// Log request details
console.log('Request URL:', pm.request.url.toString());
console.log('Request Method:', pm.request.method);
console.log('Request Headers:', pm.request.headers.toObject());
```

## 📈 Performance Testing

### Load Testing Setup
```javascript
// Set in Pre-request Script
pm.globals.set('startTime', Date.now());

// Set in Tests
const responseTime = Date.now() - pm.globals.get('startTime');
pm.test(`Response time is less than 2000ms (actual: ${responseTime}ms)`, function () {
    pm.expect(responseTime).to.be.below(2000);
});
```

## 🔄 CI/CD Integration

### Newman (CLI)
```bash
# Install Newman
npm install -g newman

# Run collection
newman run VinFast-API.postman_collection.json \
  -e VinFast-API.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json

# Run with specific folder
newman run VinFast-API.postman_collection.json \
  --folder "🔐 Authentication" \
  -e VinFast-API.postman_environment.json
```

### GitHub Actions
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run API Tests
        run: |
          npm install -g newman
          newman run backend/docs/VinFast-API.postman_collection.json \
            -e backend/docs/VinFast-API.postman_environment.json
```

## 📞 Support

Nếu gặp vấn đề với Postman Collection:

1. **Check server status**: Đảm bảo backend đang chạy
2. **Verify environment**: Kiểm tra base URL và tokens
3. **Update collection**: Download phiên bản mới nhất
4. **Check documentation**: Xem Swagger UI tại `/api-docs`

## 🎉 Happy Testing!

Collection này được thiết kế để giúp bạn test API một cách hiệu quả và toàn diện. Hãy explore và customize theo nhu cầu của bạn!
