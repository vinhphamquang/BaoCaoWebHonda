# 🔧 Khắc phục vấn đề chuyển hướng đăng nhập/đăng ký

## 🚨 Vấn đề
Khi bấm nút "Đăng nhập" hoặc "Đăng ký", trang bị chuyển hướng về trang chủ thay vì đến trang đăng nhập/đăng ký.

## 🔍 Nguyên nhân
1. **Middleware redirect**: Nếu có cookie authentication cũ, middleware sẽ redirect user đã đăng nhập về trang chủ
2. **API không hoạt động**: `/api/auth/me` không hoạt động → AuthContext không thể xác định trạng thái user
3. **Cookie cũ**: Cookie từ session trước vẫn tồn tại

## ✅ Đã khắc phục

### 1. **Cập nhật Middleware**
```typescript
// Cho phép debug trong development
if (process.env.NODE_ENV === 'development' && request.nextUrl.searchParams.get('debug') === 'true') {
  return NextResponse.next();
}
```

### 2. **Tạo trang Debug**
- Trang: `/clear-auth`
- Chức năng: Kiểm tra và xóa authentication state

### 3. **Kiểm tra tất cả links**
- ✅ Header desktop: `/login`, `/register`
- ✅ Header mobile: `/login`, `/register`
- ✅ Login page → Register: `/register`
- ✅ Register page → Login: `/login`
- ✅ Forgot password → Login: `/login`

## 🧪 Cách test và khắc phục

### Bước 1: Kiểm tra trạng thái authentication
```
Truy cập: http://localhost:3000/clear-auth
```

### Bước 2: Xóa authentication nếu cần
1. Bấm "Kiểm tra trạng thái"
2. Nếu hiển thị "Đang đăng nhập", bấm "Xóa Authentication"
3. Đợi redirect về trang đăng nhập

### Bước 3: Test các nút
1. **Header Desktop**:
   - Bấm "Đăng nhập" → Phải đến `/login`
   - Bấm "Đăng ký" → Phải đến `/register`

2. **Header Mobile**:
   - Mở menu mobile
   - Bấm "Đăng nhập" → Phải đến `/login`
   - Bấm "Đăng ký" → Phải đến `/register`

3. **Cross-links**:
   - Từ `/login` bấm "Đăng ký ngay" → Phải đến `/register`
   - Từ `/register` bấm "Đăng nhập ngay" → Phải đến `/login`

### Bước 4: Debug mode (nếu vẫn bị redirect)
```
Truy cập với debug parameter:
http://localhost:3000/login?debug=true
http://localhost:3000/register?debug=true
```

## 🔧 Các URLs quan trọng

### Trang chính
- **Đăng nhập**: `http://localhost:3000/login`
- **Đăng ký**: `http://localhost:3000/register`
- **Quên mật khẩu**: `http://localhost:3000/forgot-password`

### Debug & Test
- **Clear Auth**: `http://localhost:3000/clear-auth`
- **Test Login**: `http://localhost:3000/test-login`
- **Debug Login**: `http://localhost:3000/login?debug=true`
- **Debug Register**: `http://localhost:3000/register?debug=true`

## 🎯 Test Cases

### Case 1: User chưa đăng nhập
```
✅ Bấm "Đăng nhập" → Đến /login
✅ Bấm "Đăng ký" → Đến /register
✅ Không bị redirect về trang chủ
```

### Case 2: User đã đăng nhập
```
❌ Bấm "Đăng nhập" → Redirect về trang chủ (đúng behavior)
❌ Bấm "Đăng ký" → Redirect về trang chủ (đúng behavior)
✅ Header hiển thị thông tin user và nút "Đăng xuất"
```

### Case 3: Debug mode
```
✅ /login?debug=true → Vào được trang đăng nhập
✅ /register?debug=true → Vào được trang đăng ký
✅ Không bị middleware redirect
```

## 🚀 Sau khi khắc phục

### Behavior mong đợi:
1. **User chưa đăng nhập**:
   - Bấm "Đăng nhập" → Vào trang đăng nhập
   - Bấm "Đăng ký" → Vào trang đăng ký
   - Đăng nhập thành công → Redirect về trang chủ hoặc callback URL

2. **User đã đăng nhập**:
   - Header hiển thị tên user và avatar
   - Nút "Đăng nhập/Đăng ký" thay bằng "Đăng xuất"
   - Truy cập `/login` hoặc `/register` → Redirect về trang chủ

3. **Protected routes**:
   - Truy cập `/profile` mà chưa đăng nhập → Redirect đến `/login?callbackUrl=/profile`

## 🔗 Files đã sửa

```
src/middleware.ts - Cập nhật logic redirect
src/app/clear-auth/page.tsx - Trang debug authentication
docs/fix-login-register-redirect.md - Hướng dẫn này
```

## 📞 Commands hữu ích

```bash
# Restart server
npm run dev

# Test authentication flow
npm run test:auth

# Create test users
npm run create:user

# Test database connection
npm run test:db
```

---

**🎉 Các nút đăng nhập và đăng ký đã được sửa để chuyển hướng đúng trang!**