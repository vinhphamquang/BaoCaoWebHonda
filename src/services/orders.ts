import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS, ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '@/lib/constants';
import { Car } from './cars';
import { User } from './auth';

// Types
export interface OrderItem {
  car: string | Car;
  quantity: number;
  selectedColor: string;
  depositAmount: number;
  unitPrice: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface PaymentInfo {
  method: (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
  status: (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
  transactionId?: string;
  paidAt?: string;
  amount: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  payment: PaymentInfo;
  status: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
  notes: {
    customer?: string;
    admin?: string;
  };
  totalAmount: number;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  formattedOrderNumber: string;
  statusDisplay: string;
}

export interface CreateOrderRequest {
  items: Array<{
    car: string;
    quantity: number;
    selectedColor: string;
    depositAmount: number;
  }>;
  customerInfo: CustomerInfo;
  payment: {
    method: (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
  };
  notes?: {
    customer?: string;
  };
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
  paymentStatus?: (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UpdateOrderRequest {
  status?: keyof typeof ORDER_STATUS;
  payment?: {
    status?: keyof typeof PAYMENT_STATUS;
    transactionId?: string;
  };
  notes?: {
    admin?: string;
  };
  estimatedDelivery?: string;
  cancelReason?: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

// Orders Service
export const ordersService = {
  // Lấy danh sách đơn hàng của user
  async getMyOrders(params: OrderListParams = {}): Promise<OrderListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Order[]>>(
        `${API_ENDPOINTS.ORDERS.MY_ORDERS}?${queryParams.toString()}`
      );
      
      const data = handleApiResponse(response);
      return {
        orders: data,
        pagination: response.data.pagination || {
          page: params.page || 1,
          limit: params.limit || 10,
          total: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy tất cả đơn hàng (Admin)
  async getAllOrders(params: OrderListParams = {}): Promise<OrderListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Order[]>>(
        `${API_ENDPOINTS.ORDERS.LIST}?${queryParams.toString()}`
      );
      
      const data = handleApiResponse(response);
      return {
        orders: data,
        pagination: response.data.pagination || {
          page: params.page || 1,
          limit: params.limit || 10,
          total: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy chi tiết đơn hàng
  async getOrder(id: string): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(
        API_ENDPOINTS.ORDERS.DETAIL(id)
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tạo đơn hàng mới
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(
        API_ENDPOINTS.ORDERS.CREATE,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cập nhật đơn hàng (Admin)
  async updateOrder(id: string, data: UpdateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.put<ApiResponse<Order>>(
        API_ENDPOINTS.ORDERS.UPDATE(id),
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cập nhật trạng thái đơn hàng (Admin)
  async updateOrderStatus(id: string, status: keyof typeof ORDER_STATUS): Promise<Order> {
    try {
      const response = await apiClient.patch<ApiResponse<Order>>(
        API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
        { status }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Xóa đơn hàng (Admin)
  async deleteOrder(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        API_ENDPOINTS.ORDERS.DELETE(id)
      );
      handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy thống kê đơn hàng (Admin)
  async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await apiClient.get<ApiResponse<OrderStats>>(
        API_ENDPOINTS.ORDERS.STATS
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Hủy đơn hàng
  async cancelOrder(id: string, reason: string): Promise<Order> {
    try {
      const response = await apiClient.patch<ApiResponse<Order>>(
        API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
        { 
          status: ORDER_STATUS.CANCELLED,
          cancelReason: reason 
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default ordersService;
