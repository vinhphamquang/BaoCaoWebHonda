# 🚗 Honda Plus - Ứng dụng bán xe Honda cao cấp

Ứng dụng web bán xe Honda Plus với thiết kế đẳng cấp thế giới, được xây dựng với Next.js 15, TypeScript, MongoDB và Tailwind CSS. Trải nghiệm mua xe Honda premium với giao diện hiện đại và dịch vụ 5 sao.

## ✨ Tính năng Honda Plus

### 🏆 **Honda Plus Premium Experience**
- **Giao diện đẳng cấp**: Thiết kế sang trọng với gradient effects và animations cao cấp
- **Honda Plus Membership**: Hệ thống thành viên VIP với các đặc quyền độc quyền
- **Premium Showroom**: Trải nghiệm mua xe online như showroom thực tế
- **Concierge Service**: Dịch vụ tư vấn cá nhân hóa 1-1

### 🚗 **Showroom Honda Plus**
- Hiển thị bộ sưu tập xe Honda cao cấp với hình ảnh HD
- Tìm kiếm thông minh với AI-powered recommendations
- Xem chi tiết 360° với thông số kỹ thuật đầy đủ
- Virtual test drive và AR visualization
- Chế độ xem grid/list với hover effects cao cấp

### 🛒 **Smart Cart & Checkout**
- Giỏ hàng thông minh với real-time pricing
- Multiple payment options (trả góp 0%, leasing)
- Express checkout cho Honda Plus members
- Delivery tracking và white-glove service

### 📱 **Premium Mobile Experience**
- Responsive design với mobile-first approach
- Touch-optimized interactions
- Progressive Web App (PWA) capabilities
- Offline browsing cho catalog

### 🎨 **Honda Plus Design System**
- **Color Palette**: Honda Red, Premium Gold, Platinum Silver
- **Typography**: Inter font với custom weights
- **Animations**: Smooth transitions và micro-interactions
- **Components**: Reusable UI components với Honda Plus branding

### 🔧 **Enterprise-Grade Architecture**
- Next.js 15 với App Router và Server Components
- TypeScript cho type safety
- MongoDB với advanced indexing
- Redis caching cho performance
- Error tracking và monitoring

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes với Swagger documentation
- **Database**: MongoDB, Mongoose
- **UI Components**: Custom components với Lucide React icons
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest, Postman/Newman
- **DevOps**: Docker, GitHub Actions CI/CD
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Notifications**: Custom Toast system

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

### 1. Clone repository
```bash
git clone <repository-url>
cd shopcar
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env.local` trong thư mục gốc:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/honda-car-shop
# Hoặc sử dụng MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/honda-car-shop

# Next.js
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Khởi động MongoDB
Đảm bảo MongoDB đang chạy trên máy local hoặc có kết nối Atlas.

### 5. Seed dữ liệu mẫu
```bash
# Truy cập URL sau để tạo dữ liệu mẫu:
curl -X POST http://localhost:3000/api/seed
```

### 6. Chạy ứng dụng
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc dự án

```
shopcar/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── cars/         # CRUD xe Honda
│   │   │   ├── orders/       # Quản lý đơn hàng
│   │   │   └── seed/         # Seed dữ liệu
│   │   ├── cars/             # Trang danh sách xe
│   │   ├── cart/             # Trang giỏ hàng
│   │   ├── contact/          # Trang liên hệ
│   │   ├── about/            # Trang giới thiệu
│   │   ├── layout.tsx        # Layout chính
│   │   └── page.tsx          # Trang chủ
│   ├── components/            # React components
│   │   ├── ui/               # UI components cơ bản
│   │   ├── cars/             # Components liên quan xe
│   │   └── layout/           # Header, Footer
│   ├── contexts/             # React Context
│   ├── lib/                  # Utilities, database
│   ├── models/               # MongoDB schemas
│   └── types/                # TypeScript interfaces
├── public/                   # Static files
└── package.json
```

## 📖 API Documentation

Honda Plus cung cấp API documentation hoàn chỉnh với Swagger/OpenAPI:

- **📖 Interactive Docs**: http://localhost:3001/api/docs
- **🔍 OpenAPI Spec**: http://localhost:3001/api/swagger
- **📋 API Reference**: [API.md](./API.md)
- **🧪 Postman Collection**: `postman/Honda-Plus-API.postman_collection.json`

## 🔌 API Endpoints

### 🏥 Health Check
- `GET /api/health` - API health check với system metrics

### 🚗 Cars API
- `GET /api/cars` - Lấy danh sách xe (có pagination, filter, sort)
- `GET /api/cars/{id}` - Lấy chi tiết xe theo ID

### 📋 Orders API
- `GET /api/orders` - Lấy danh sách đơn hàng với filtering
- `POST /api/orders` - Tạo đơn hàng mới

### 🗄️ Database API
- `POST /api/seed` - Seed dữ liệu mẫu (development only)

### 🧪 Testing API
```bash
# Test với curl
curl http://localhost:3001/api/health
curl "http://localhost:3001/api/cars?limit=5"

# Test với Postman
npm run postman:test
```

## 🎨 Tính năng UI/UX

### Components chính
- **CarCard**: Hiển thị thông tin xe với hover effects
- **Header**: Navigation với search và cart counter
- **Footer**: Thông tin liên hệ và links
- **Toast**: Thông báo real-time
- **Loading**: Skeleton loading states

### Responsive Design
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Import project vào Vercel
3. Cấu hình environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Chạy linter
npm run lint

# Build production
npm run build
```

## 📝 Dữ liệu mẫu

Ứng dụng bao gồm dữ liệu mẫu cho 6 dòng xe Honda:
- Honda Civic 2024
- Honda CR-V 2024
- Honda Accord 2024
- Honda City 2024
- Honda HR-V 2024
- Honda Pilot 2024

Mỗi xe có đầy đủ thông tin: giá, màu sắc, thông số kỹ thuật, tính năng an toàn.

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Email**: info@hondashop.vn
- **Phone**: 1900-1234
- **Website**: [Honda Shop](http://localhost:3000)

---

**Honda Shop** - *Uy tín - Chất lượng - Giá tốt nhất thị trường* 🚗✨
