// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Cars
  CARS: {
    LIST: '/cars',
    DETAIL: (id: string) => `/cars/${id}`,
    FEATURED: '/cars/featured',
    SEARCH: '/cars/search',
    BY_TYPE: (type: string) => `/cars/type/${type}`,
    CREATE: '/cars',
    UPDATE: (id: string) => `/cars/${id}`,
    DELETE: (id: string) => `/cars/${id}`,
    UPLOAD_IMAGES: (id: string) => `/cars/${id}/images`,
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    MY_ORDERS: '/orders/my-orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    STATS: '/orders/stats/revenue',
  },
  
  // Test Drive
  TEST_DRIVE: {
    LIST: '/test-drive',
    MY_TEST_DRIVES: '/test-drive/my-test-drives',
    DETAIL: (id: string) => `/test-drive/${id}`,
    CREATE: '/test-drive',
    UPDATE: (id: string) => `/test-drive/${id}`,
    DELETE: (id: string) => `/test-drive/${id}`,
    AVAILABLE_SLOTS: '/test-drive/available-slots',
    UPDATE_STATUS: (id: string) => `/test-drive/${id}/status`,
  },
  
  // Contact
  CONTACT: {
    LIST: '/contact',
    SEND: '/contact',
    DETAIL: (id: string) => `/contact/${id}`,
    UPDATE_STATUS: (id: string) => `/contact/${id}/status`,
  },
  
  // News
  NEWS: {
    LIST: '/news',
    FEATURED: '/news/featured',
    SEARCH: '/news/search',
    DETAIL: (slug: string) => `/news/${slug}`,
    CREATE: '/news',
    UPDATE: (id: string) => `/news/${id}`,
    DELETE: (id: string) => `/news/${id}`,
  },
  
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    STATS: '/users/stats',
  },
  
  // Health Check
  HEALTH: '/health',
};

// Car Types
export const CAR_TYPES = {
  ELECTRIC: 'electric',
  HYBRID: 'hybrid',
  GASOLINE: 'gasoline',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  CASH: 'cash',
} as const;

// Test Drive Status
export const TEST_DRIVE_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Contact Status
export const CONTACT_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

// Status display mappings
export const STATUS_DISPLAY = {
  ORDER: {
    [ORDER_STATUS.PENDING]: 'Chờ xử lý',
    [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
    [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
    [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
    [ORDER_STATUS.CANCELLED]: 'Đã hủy',
  },
  PAYMENT: {
    [PAYMENT_STATUS.PENDING]: 'Chờ thanh toán',
    [PAYMENT_STATUS.COMPLETED]: 'Đã thanh toán',
    [PAYMENT_STATUS.FAILED]: 'Thanh toán thất bại',
    [PAYMENT_STATUS.REFUNDED]: 'Đã hoàn tiền',
  },
  TEST_DRIVE: {
    [TEST_DRIVE_STATUS.PENDING]: 'Chờ xác nhận',
    [TEST_DRIVE_STATUS.CONFIRMED]: 'Đã xác nhận',
    [TEST_DRIVE_STATUS.COMPLETED]: 'Đã hoàn thành',
    [TEST_DRIVE_STATUS.CANCELLED]: 'Đã hủy',
  },
  CONTACT: {
    [CONTACT_STATUS.NEW]: 'Mới',
    [CONTACT_STATUS.IN_PROGRESS]: 'Đang xử lý',
    [CONTACT_STATUS.RESOLVED]: 'Đã giải quyết',
    [CONTACT_STATUS.CLOSED]: 'Đã đóng',
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Lỗi server, vui lòng thử lại sau',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  UNKNOWN_ERROR: 'Có lỗi xảy ra, vui lòng thử lại',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  CREATE_SUCCESS: 'Tạo mới thành công',
  DELETE_SUCCESS: 'Xóa thành công',
  ORDER_SUCCESS: 'Đặt hàng thành công',
  CONTACT_SUCCESS: 'Gửi liên hệ thành công',
  TEST_DRIVE_SUCCESS: 'Đăng ký lái thử thành công',
} as const;
