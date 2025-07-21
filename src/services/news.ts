import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS, PAGINATION } from '@/lib/constants';

// Types
export interface News {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  images: string[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  category: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  published?: boolean;
  sort?: string;
}

export interface NewsListResponse {
  news: News[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateNewsRequest {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  images?: string[];
  category: string;
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// News Service
export const newsService = {
  // Lấy danh sách tin tức
  async getNews(params: NewsListParams = {}): Promise<NewsListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Thêm các params vào query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<News[]>>(
        `${API_ENDPOINTS.NEWS.LIST}?${queryParams.toString()}`
      );
      
      const data = handleApiResponse(response);
      return {
        news: data,
        pagination: response.data.pagination || {
          page: params.page || PAGINATION.DEFAULT_PAGE,
          limit: params.limit || PAGINATION.DEFAULT_LIMIT,
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

  // Lấy tin tức nổi bật
  async getFeaturedNews(limit?: number): Promise<News[]> {
    try {
      const queryParams = limit ? `?limit=${limit}` : '';
      const response = await apiClient.get<ApiResponse<News[]>>(
        `${API_ENDPOINTS.NEWS.FEATURED}${queryParams}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tìm kiếm tin tức
  async searchNews(query: string, params: Omit<NewsListParams, 'search'> = {}): Promise<NewsListResponse> {
    try {
      const searchParams = { ...params, search: query };
      return await this.getNews(searchParams);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy chi tiết tin tức
  async getNewsDetail(slug: string): Promise<News> {
    try {
      const response = await apiClient.get<ApiResponse<News>>(
        API_ENDPOINTS.NEWS.DETAIL(slug)
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Tạo tin tức mới (Admin)
  async createNews(data: CreateNewsRequest): Promise<News> {
    try {
      const response = await apiClient.post<ApiResponse<News>>(
        API_ENDPOINTS.NEWS.CREATE,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cập nhật tin tức (Admin)
  async updateNews(id: string, data: Partial<CreateNewsRequest>): Promise<News> {
    try {
      const response = await apiClient.put<ApiResponse<News>>(
        API_ENDPOINTS.NEWS.UPDATE(id),
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Xóa tin tức (Admin)
  async deleteNews(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        API_ENDPOINTS.NEWS.DELETE(id)
      );
      handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy các danh mục tin tức
  async getCategories(): Promise<string[]> {
    try {
      // Tạm thời return static data, có thể tạo endpoint riêng sau
      return [
        'Tin tức công ty',
        'Ra mắt sản phẩm',
        'Công nghệ',
        'Môi trường',
        'Sự kiện',
        'Khuyến mãi',
        'Hướng dẫn sử dụng',
        'Bảo dưỡng'
      ];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy các tag phổ biến
  async getPopularTags(): Promise<string[]> {
    try {
      // Tạm thời return static data, có thể tạo endpoint riêng sau
      return [
        'VinFast',
        'xe điện',
        'công nghệ',
        'môi trường',
        'pin xe điện',
        'sạc nhanh',
        'tự lái',
        'an toàn',
        'thiết kế',
        'hiệu suất'
      ];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default newsService;
