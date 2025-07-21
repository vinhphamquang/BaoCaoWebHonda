# 📚 Swagger API Documentation Guide

## 🌟 Tổng quan

Swagger UI đã được tích hợp vào VinFast Backend API để cung cấp documentation tương tác và testing interface cho tất cả API endpoints.

## 🔗 Truy cập Swagger UI

- **URL**: `http://localhost:8000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

## 🎯 Tính năng chính

### 1. **Interactive Documentation**
- Xem tất cả API endpoints
- Chi tiết request/response schemas
- Ví dụ request/response
- Validation rules

### 2. **API Testing**
- Test trực tiếp từ browser
- Authentication với JWT token
- Real-time response
- Error handling examples

### 3. **Schema Documentation**
- Tất cả data models
- Required/optional fields
- Data types và formats
- Validation constraints

## 🔐 Authentication trong Swagger

### Cách sử dụng JWT Token:

1. **Đăng nhập để lấy token:**
   ```bash
   POST /api/auth/login
   {
     "email": "admin@vinfast.com",
     "password": "admin123"
   }
   ```

2. **Copy token từ response**

3. **Authorize trong Swagger:**
   - Click nút "Authorize" ở đầu trang
   - Nhập: `Bearer <your_token_here>`
   - Click "Authorize"

4. **Test protected endpoints**

## 📋 API Categories

### 🔐 Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user
- `POST /api/auth/logout` - Đăng xuất

### 🚗 Cars
- `GET /api/cars` - Danh sách xe
- `GET /api/cars/featured` - Xe nổi bật
- `GET /api/cars/{id}` - Chi tiết xe
- `POST /api/cars` - Tạo xe (Admin)
- `PUT /api/cars/{id}` - Cập nhật xe (Admin)

### 📦 Orders
- `GET /api/orders/my-orders` - Đơn hàng của user
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/{id}` - Chi tiết đơn hàng
- `GET /api/orders` - Tất cả đơn hàng (Admin)

### 🚙 Test Drive
- `POST /api/test-drive` - Đăng ký lái thử
- `GET /api/test-drive/available-slots` - Slot trống
- `GET /api/test-drive/my-test-drives` - Lái thử của user
- `GET /api/test-drive` - Tất cả lái thử (Admin)

### 📞 Contact
- `POST /api/contact` - Gửi liên hệ
- `GET /api/contact` - Danh sách liên hệ (Admin)
- `POST /api/contact/{id}/respond` - Phản hồi (Admin)

### 📰 News
- `GET /api/news` - Danh sách tin tức
- `GET /api/news/featured` - Tin tức nổi bật
- `GET /api/news/{slug}` - Chi tiết tin tức
- `POST /api/news` - Tạo tin tức (Admin)

### 👥 Users
- `GET /api/users` - Danh sách user (Admin)
- `POST /api/users` - Tạo user (Admin)
- `PUT /api/users/{id}` - Cập nhật user (Admin)

## 🧪 Testing Examples

### 1. **Test đăng nhập:**
```json
POST /api/auth/login
{
  "email": "admin@vinfast.com",
  "password": "admin123"
}
```

### 2. **Test lấy danh sách xe:**
```bash
GET /api/cars?page=1&limit=10&type=electric
```

### 3. **Test tạo đơn hàng:**
```json
POST /api/orders
Authorization: Bearer <token>
{
  "items": [
    {
      "car": "car_id_here",
      "quantity": 1,
      "selectedColor": "Trắng",
      "depositAmount": 50000000
    }
  ],
  "customerInfo": {
    "fullName": "Nguyễn Văn A",
    "email": "customer@example.com",
    "phone": "0123456789",
    "address": "123 ABC Street",
    "city": "Hà Nội"
  },
  "payment": {
    "method": "bank_transfer"
  }
}
```

## 🔧 Customization

### Thêm documentation cho endpoint mới:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Mô tả ngắn
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *                 example: "value"
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
```

### Thêm schema mới:

```javascript
// Trong config/swagger.js
components: {
  schemas: {
    YourModel: {
      type: 'object',
      required: ['field1', 'field2'],
      properties: {
        field1: {
          type: 'string',
          description: 'Mô tả field'
        }
      }
    }
  }
}
```

## 🚀 Production Setup

### Environment Variables:
```env
NODE_ENV=production
API_URL=https://api.vinfast.com
```

### Security Headers:
```javascript
app.use('/api-docs', (req, res, next) => {
  // Add authentication if needed
  next();
}, swaggerUi.serve, swaggerUi.setup(specs));
```

## 📝 Best Practices

1. **Luôn cập nhật documentation** khi thay đổi API
2. **Sử dụng examples** rõ ràng và thực tế
3. **Document tất cả error cases**
4. **Sử dụng consistent naming**
5. **Group endpoints** theo chức năng
6. **Include authentication requirements**
7. **Validate schemas** với real data

## 🐛 Troubleshooting

### Swagger không load:
- Kiểm tra server đang chạy
- Verify port number
- Check console errors

### Schema errors:
- Validate YAML syntax
- Check schema references
- Verify component definitions

### Authentication issues:
- Ensure JWT token format: `Bearer <token>`
- Check token expiration
- Verify token permissions

## 📞 Support

Nếu có vấn đề với Swagger documentation:
1. Check server logs
2. Validate swagger syntax
3. Test endpoints manually
4. Contact development team
