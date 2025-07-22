# 🔧 Khắc phục lỗi đăng nhập Honda Plus

## 🚨 Vấn đề hiện tại
Khi bấm nút "Đăng nhập", trang bị chuyển hướng về trang chủ thay vì xử lý đăng nhập.

## 🔍 Nguyên nhân có thể
1. **API Login không hoạt động** - Server không load được API routes
2. **MongoDB connection lỗi** - Database không kết nối được
3. **AuthContext lỗi** - Context không xử lý đúng response
4. **User không tồn tại** - Tài khoản test chưa được tạo

## ✅ Đã thực hiện
1. ✅ Tạo User model với password hashing
2. ✅ Tạo API login endpoint (`/api/auth/login`)
3. ✅ Tạo tài khoản test:
   - Email: `test@honda.com`
   - Password: `123456`
   - Admin: `admin@honda.com` / `admin123`
4. ✅ Cải thiện giao diện trang đăng nhập
5. ✅ Thêm validation và error handling
6. ✅ Tạo trang test login (`/test-login`)

## 🧪 Cách kiểm tra

### 1. Kiểm tra API hoạt động
Truy cập: `http://localhost:3000/test-login`

### 2. Kiểm tra MongoDB connection
```bash
npm run test:db
```

### 3. Kiểm tra user đã tạo
```bash
npm run create:user
```

### 4. Test API trực tiếp
```bash
# Kiểm tra health
curl http://localhost:3000/api/health

# Test login (PowerShell)
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@honda.com","password":"123456"}'
```

## 🔧 Các bước khắc phục

### Bước 1: Restart Server
```bash
# Dừng server (Ctrl+C)
# Khởi động lại
npm run dev
```

### Bước 2: Kiểm tra Environment Variables
Đảm bảo `.env.local` có:
```env
MONGODB_URI=mongodb+srv://dinh:11122004@cuahangoto.ywhsxsf.mongodb.net/honda_plus?retryWrites=true&w=majority&appName=cuahangoto
JWT_SECRET=your-secret-key-here
```

### Bước 3: Kiểm tra Console Logs
1. Mở Developer Tools (F12)
2. Vào tab Console
3. Thử đăng nhập và xem lỗi

### Bước 4: Test từng component

#### Test AuthContext:
```javascript
// Trong browser console
console.log('Testing AuthContext...');
```

#### Test API Login:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@honda.com',
    password: '123456'
  })
}).then(r => r.json()).then(console.log);
```

## 🎯 Kết quả mong đợi

### Đăng nhập thành công:
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@honda.com",
    "role": "user"
  }
}
```

### Đăng nhập thất bại:
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

## 🚀 Sau khi khắc phục

1. **Đăng nhập thành công** → Chuyển hướng đến trang được yêu cầu
2. **Đăng nhập thất bại** → Hiển thị thông báo lỗi
3. **Header cập nhật** → Hiển thị tên user và menu dropdown
4. **Protected routes** → Hoạt động với middleware

## 📞 Debug Commands

```bash
# Tạo user test
npm run create:user

# Test database
npm run test:db

# Seed cars data
npm run seed

# Check all APIs
npm run test:api
```

## 🔗 Files liên quan

- `src/app/login/page.tsx` - Trang đăng nhập
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/app/api/auth/login/route.ts` - API login
- `src/models/User.ts` - User model
- `src/app/test-login/page.tsx` - Trang test login
- `scripts/create-test-user.js` - Script tạo user test

---

**Lưu ý**: Nếu vẫn gặp vấn đề, hãy kiểm tra trang `/test-login` để debug chi tiết hơn.