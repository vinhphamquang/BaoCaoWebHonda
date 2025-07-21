import { useCallback } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import ordersService, { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  OrderListParams 
} from '@/services/orders';
import { ORDER_STATUS } from '@/lib/constants';

// Hook để lấy đơn hàng của user hiện tại
export function useMyOrders(params: OrderListParams = {}, immediate: boolean = true) {
  return usePaginatedApi(
    async (paginationParams) => {
      const result = await ordersService.getMyOrders({ ...params, ...paginationParams });
      return {
        data: result.orders,
        pagination: result.pagination,
      };
    },
    params,
    immediate
  );
}

// Hook để lấy tất cả đơn hàng (Admin)
export function useAllOrders(params: OrderListParams = {}, immediate: boolean = true) {
  return usePaginatedApi(
    async (paginationParams) => {
      const result = await ordersService.getAllOrders({ ...params, ...paginationParams });
      return {
        data: result.orders,
        pagination: result.pagination,
      };
    },
    params,
    immediate
  );
}

// Hook để lấy chi tiết đơn hàng
export function useOrder(id: string, immediate: boolean = true) {
  return useApi(
    () => ordersService.getOrder(id),
    [id],
    immediate
  );
}

// Hook để tạo đơn hàng mới
export function useCreateOrder() {
  return useMutation(ordersService.createOrder);
}

// Hook để cập nhật đơn hàng (Admin)
export function useUpdateOrder() {
  return useMutation((params: { id: string; data: UpdateOrderRequest }) =>
    ordersService.updateOrder(params.id, params.data)
  );
}

// Hook để cập nhật trạng thái đơn hàng (Admin)
export function useUpdateOrderStatus() {
  return useMutation((params: { id: string; status: keyof typeof ORDER_STATUS }) =>
    ordersService.updateOrderStatus(params.id, params.status)
  );
}

// Hook để xóa đơn hàng (Admin)
export function useDeleteOrder() {
  return useMutation(ordersService.deleteOrder);
}

// Hook để hủy đơn hàng
export function useCancelOrder() {
  return useMutation((params: { id: string; reason: string }) =>
    ordersService.cancelOrder(params.id, params.reason)
  );
}

// Hook để lấy thống kê đơn hàng (Admin)
export function useOrderStats(immediate: boolean = true) {
  return useApi(
    () => ordersService.getOrderStats(),
    [],
    immediate
  );
}

// Hook tổng hợp cho quản lý đơn hàng
export function useOrderManagement() {
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const cancelOrder = useCancelOrder();

  const handleCreateOrder = useCallback(async (data: CreateOrderRequest) => {
    return await createOrder.mutate(data);
  }, [createOrder]);

  const handleUpdateOrder = useCallback(async (id: string, data: UpdateOrderRequest) => {
    return await updateOrder.mutate({ id, data });
  }, [updateOrder]);

  const handleUpdateOrderStatus = useCallback(async (id: string, status: keyof typeof ORDER_STATUS) => {
    return await updateOrderStatus.mutate({ id, status });
  }, [updateOrderStatus]);

  const handleDeleteOrder = useCallback(async (id: string) => {
    return await deleteOrder.mutate(id);
  }, [deleteOrder]);

  const handleCancelOrder = useCallback(async (id: string, reason: string) => {
    return await cancelOrder.mutate({ id, reason });
  }, [cancelOrder]);

  return {
    createOrder: {
      mutate: handleCreateOrder,
      loading: createOrder.loading,
      error: createOrder.error,
      data: createOrder.data,
      reset: createOrder.reset,
    },
    updateOrder: {
      mutate: handleUpdateOrder,
      loading: updateOrder.loading,
      error: updateOrder.error,
      data: updateOrder.data,
      reset: updateOrder.reset,
    },
    updateOrderStatus: {
      mutate: handleUpdateOrderStatus,
      loading: updateOrderStatus.loading,
      error: updateOrderStatus.error,
      data: updateOrderStatus.data,
      reset: updateOrderStatus.reset,
    },
    deleteOrder: {
      mutate: handleDeleteOrder,
      loading: deleteOrder.loading,
      error: deleteOrder.error,
      reset: deleteOrder.reset,
    },
    cancelOrder: {
      mutate: handleCancelOrder,
      loading: cancelOrder.loading,
      error: cancelOrder.error,
      data: cancelOrder.data,
      reset: cancelOrder.reset,
    },
  };
}

// Hook để lọc đơn hàng
export function useOrderFilters() {
  const applyFilters = useCallback((orders: Order[], filters: {
    search?: string;
    status?: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
    startDate?: string;
    endDate?: string;
    sortBy?: 'createdAt' | 'totalAmount' | 'status';
    sortOrder?: 'asc' | 'desc';
  }) => {
    let filteredOrders = [...orders];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.customerInfo.fullName.toLowerCase().includes(searchTerm) ||
        order.customerInfo.email.toLowerCase().includes(searchTerm) ||
        order.customerInfo.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) >= startDate
      );
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) <= endDate
      );
    }

    // Sorting
    if (filters.sortBy) {
      filteredOrders.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (filters.sortBy === 'createdAt') {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else if (filters.sortBy === 'totalAmount') {
          aValue = a.totalAmount;
          bValue = b.totalAmount;
        } else if (filters.sortBy === 'status') {
          aValue = a.status;
          bValue = b.status;
        } else {
          return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return filteredOrders;
  }, []);

  return { applyFilters };
}

// Hook để tính toán thống kê đơn hàng
export function useOrderCalculations() {
  const calculateOrderTotal = useCallback((order: Order) => {
    return order.items.reduce((total, item) => {
      return total + (item.depositAmount * item.quantity);
    }, 0);
  }, []);

  const calculateOrderSummary = useCallback((orders: Order[]) => {
    const summary = {
      totalOrders: orders.length,
      totalRevenue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
    };

    orders.forEach(order => {
      summary.totalRevenue += order.totalAmount;
      
      switch (order.status) {
        case ORDER_STATUS.PENDING:
          summary.pendingOrders++;
          break;
        case ORDER_STATUS.CONFIRMED:
          summary.confirmedOrders++;
          break;
        case ORDER_STATUS.PROCESSING:
          summary.processingOrders++;
          break;
        case ORDER_STATUS.COMPLETED:
          summary.completedOrders++;
          break;
        case ORDER_STATUS.CANCELLED:
          summary.cancelledOrders++;
          break;
      }
    });

    return summary;
  }, []);

  return {
    calculateOrderTotal,
    calculateOrderSummary,
  };
}

export default useMyOrders;
