import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS, CONTACT_STATUS } from '@/lib/constants';

// Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: (typeof CONTACT_STATUS)[keyof typeof CONTACT_STATUS];
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendContactRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  status?: (typeof CONTACT_STATUS)[keyof typeof CONTACT_STATUS];
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ContactListResponse {
  contacts: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UpdateContactStatusRequest {
  status: (typeof CONTACT_STATUS)[keyof typeof CONTACT_STATUS];
  response?: string;
}

// Contact Service
export const contactService = {
  // Gửi liên hệ
  async sendContact(data: SendContactRequest): Promise<Contact> {
    try {
      const response = await apiClient.post<ApiResponse<Contact>>(
        API_ENDPOINTS.CONTACT.SEND,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Lấy danh sách liên hệ (Admin)
  async getContacts(params: ContactListParams = {}): Promise<ContactListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get<ApiResponse<Contact[]>>(
        `${API_ENDPOINTS.CONTACT.LIST}?${queryParams.toString()}`
      );
      
      const data = handleApiResponse(response);
      return {
        contacts: data,
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

  // Lấy chi tiết liên hệ (Admin)
  async getContact(id: string): Promise<Contact> {
    try {
      const response = await apiClient.get<ApiResponse<Contact>>(
        API_ENDPOINTS.CONTACT.DETAIL(id)
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Cập nhật trạng thái liên hệ (Admin)
  async updateContactStatus(id: string, data: UpdateContactStatusRequest): Promise<Contact> {
    try {
      const response = await apiClient.patch<ApiResponse<Contact>>(
        API_ENDPOINTS.CONTACT.UPDATE_STATUS(id),
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default contactService;
