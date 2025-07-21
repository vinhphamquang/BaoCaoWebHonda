# API Integration Guide

## 📋 Tổng quan

Dự án đã được tích hợp hoàn chỉnh với backend API. Frontend Next.js hiện có thể kết nối và tương tác với backend Express.js thông qua các service và hook được tạo sẵn.

## 🚀 Cấu trúc API Integration

### 1. **Core API Configuration**
- `src/lib/api.ts` - Axios client với interceptors
- `src/lib/constants.ts` - API endpoints và constants
- `.env.local` - Environment variables

### 2. **Services Layer**
- `src/services/auth.ts` - Authentication API calls
- `src/services/cars.ts` - Cars management API
- `src/services/orders.ts` - Orders management API
- `src/services/contact.ts` - Contact form API
- `src/services/news.ts` - News management API

### 3. **Custom Hooks**
- `src/hooks/useApi.ts` - Generic API hooks
- `src/hooks/useAuth.ts` - Authentication hooks
- `src/hooks/useCars.ts` - Cars data hooks
- `src/hooks/useOrders.ts` - Orders data hooks

### 4. **State Management**
- `src/stores/useAuthStore.ts` - Authentication state (updated)
- `src/stores/useCartStore.ts` - Cart state with API integration

### 5. **Components**
- `src/components/AuthProvider.tsx` - Auth initialization

## 🔧 Cách sử dụng

### Authentication

```typescript
import { useAuthStore } from '@/stores/useAuthStore';

function LoginComponent() {
  const { login, loading, error } = useAuthStore();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // User logged in successfully
    } catch (error) {
      // Handle login error
    }
  };
}
```

### Cars Data

```typescript
import { useCars, useFeaturedCars } from '@/hooks/useCars';

function CarsPage() {
  const { data: cars, loading, error, refetch } = useCars({
    page: 1,
    limit: 10,
    type: 'electric'
  });
  
  const { data: featuredCars } = useFeaturedCars(6);
}
```

### Orders Management

```typescript
import { useMyOrders, useCreateOrder } from '@/hooks/useOrders';

function OrdersPage() {
  const { data: orders, loading } = useMyOrders();
  const createOrder = useCreateOrder();
  
  const handleCreateOrder = async (orderData) => {
    try {
      await createOrder.mutate(orderData);
      // Order created successfully
    } catch (error) {
      // Handle error
    }
  };
}
```

### Cart with Checkout

```typescript
import { useCartStore } from '@/stores/useCartStore';

function CartComponent() {
  const { items, checkout, loading, error } = useCartStore();
  
  const handleCheckout = async (customerInfo, paymentMethod) => {
    try {
      await checkout(customerInfo, paymentMethod);
      // Order placed successfully
    } catch (error) {
      // Handle checkout error
    }
  };
}
```

## 🔐 Authentication Flow

1. **Login/Register** - User credentials sent to API
2. **Token Storage** - JWT token stored in localStorage
3. **Auto-initialization** - AuthProvider checks token on app load
4. **Request Interceptor** - Token automatically added to API requests
5. **Response Interceptor** - Handles 401 errors and redirects

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Cars
- `GET /api/cars` - Get cars list
- `GET /api/cars/featured` - Get featured cars
- `GET /api/cars/:id` - Get car details
- `POST /api/cars` - Create car (Admin)

### Orders
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Contact
- `POST /api/contact` - Send contact message

### News
- `GET /api/news` - Get news list
- `GET /api/news/featured` - Get featured news
- `GET /api/news/:slug` - Get news details

## 🛠️ Environment Setup

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=VinFast Cửa Hàng Ô Tô
NODE_ENV=development
```

## 🚀 Chạy dự án

1. **Start Backend:**
```bash
cd backend
npm start
```

2. **Start Frontend:**
```bash
npm run dev
```

3. **Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Documentation: http://localhost:5000/api-docs

## 🔄 Error Handling

- **Network errors** - Automatic retry và user notification
- **Authentication errors** - Auto logout và redirect
- **Validation errors** - Form field highlighting
- **Server errors** - User-friendly error messages

## 📝 Type Safety

Tất cả API calls đều có TypeScript types:
- Request/Response interfaces
- Error handling types
- State management types
- Hook return types

## 🎯 Next Steps

1. **Testing** - Viết unit tests cho services và hooks
2. **Caching** - Implement React Query cho better caching
3. **Offline Support** - Add service worker cho offline functionality
4. **Real-time** - Integrate WebSocket cho real-time updates

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Error** - Kiểm tra backend CORS configuration
2. **401 Unauthorized** - Token expired, cần login lại
3. **Network Error** - Kiểm tra backend server đang chạy
4. **Type Errors** - Kiểm tra API response structure

### Debug Tips:

- Check browser Network tab cho API calls
- Check Console cho error messages
- Verify backend logs
- Test API endpoints với Postman/Swagger
