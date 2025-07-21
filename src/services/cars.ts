import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS, CAR_TYPES, PAGINATION } from '@/lib/constants';

// Types
export interface Car {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: (typeof CAR_TYPES)[keyof typeof CAR_TYPES];
  brand: string;
  model: string;
  year: number;
  images: string[];
  specifications: {
    engine?: string;
    power?: string;
    torque?: string;
    transmission?: string;
    fuelType?: string;
    fuelConsumption?: string;
    acceleration?: string;
    topSpeed?: string;
    range?: string;
    batteryCapacity?: string;
    chargingTime?: string;
    seatingCapacity?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      wheelbase?: number;
    };
    weight?: number;
    trunkCapacity?: number;
  };
  features: string[];
  colors: Array<{
    name: string;
    code: string;
    image?: string;
  }>;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarListParams {
  page?: number;
  limit?: number;
  type?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  search?: string;
  sort?: string;
  featured?: boolean;
  [key: string]: unknown;
}

export interface CarListResponse {
  cars: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateCarRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: string;
  brand: string;
  model: string;
  year: number;
  specifications: Car['specifications'];
  features: string[];
  colors: Car['colors'];
  stock: number;
  isFeatured?: boolean;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

// Cars Service
export const carsService = {
  // Lấy danh sách xe
  async getCars(params: CarListParams = {}): Promise<CarListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Thêm các params vào query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Car[]>>(
        `${API_ENDPOINTS.CARS.LIST}?${queryParams.toString()}`
      );
      
      const data = handleApiResponse(response);
      const pagination = response.data.pagination || {
        page: params.page || PAGINATION.DEFAULT_PAGE,
        limit: params.limit || PAGINATION.DEFAULT_LIMIT,
        total: data.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      return {
        cars: data,
        pagination,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy xe nổi bật
  async getFeaturedCars(limit?: number): Promise<Car[]> {
    try {
      const queryParams = limit ? `?limit=${limit}` : '';
      const response = await apiClient.get<ApiResponse<Car[]>>(
        `${API_ENDPOINTS.CARS.FEATURED}${queryParams}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tìm kiếm xe
  async searchCars(query: string, params: Omit<CarListParams, 'search'> = {}): Promise<CarListResponse> {
    try {
      const searchParams = { ...params, search: query };
      return await this.getCars(searchParams);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy xe theo loại
  async getCarsByType(type: string, params: Omit<CarListParams, 'type'> = {}): Promise<CarListResponse> {
    try {
      const typeParams = { ...params, type };
      return await this.getCars(typeParams);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy chi tiết xe
  async getCar(id: string): Promise<Car> {
    try {
      const response = await apiClient.get<ApiResponse<Car>>(
        API_ENDPOINTS.CARS.DETAIL(id)
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tạo xe mới (Admin)
  async createCar(data: CreateCarRequest): Promise<Car> {
    try {
      const response = await apiClient.post<ApiResponse<Car>>(
        API_ENDPOINTS.CARS.CREATE,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cập nhật xe (Admin)
  async updateCar(id: string, data: Partial<CreateCarRequest>): Promise<Car> {
    try {
      const response = await apiClient.put<ApiResponse<Car>>(
        API_ENDPOINTS.CARS.UPDATE(id),
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Xóa xe (Admin)
  async deleteCar(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        API_ENDPOINTS.CARS.DELETE(id)
      );
      handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Upload hình ảnh xe (Admin)
  async uploadCarImages(id: string, images: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append(`images`, image);
      });

      const response = await apiClient.post<ApiResponse<string[]>>(
        API_ENDPOINTS.CARS.UPLOAD_IMAGES(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy các thương hiệu có sẵn
  async getBrands(): Promise<string[]> {
    try {
      // Tạm thời return static data, có thể tạo endpoint riêng sau
      return ['VinFast', 'Toyota', 'Honda', 'Mazda', 'Hyundai', 'Kia'];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy các năm có sẵn
  async getYears(): Promise<number[]> {
    try {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = currentYear; year >= currentYear - 10; year--) {
        years.push(year);
      }
      return years;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default carsService;
