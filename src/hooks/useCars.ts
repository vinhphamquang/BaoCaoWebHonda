import { useCallback } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import carsService, { Car, CarListParams, CreateCarRequest } from '@/services/cars';

// Hook để lấy danh sách xe với pagination
export function useCars(params: CarListParams = {}, immediate: boolean = true) {
  return usePaginatedApi(
    async (paginationParams) => {
      const result = await carsService.getCars({ ...params, ...paginationParams });
      return {
        data: result.cars,
        pagination: result.pagination,
      };
    },
    params,
    immediate
  );
}

// Hook để lấy xe nổi bật
export function useFeaturedCars(limit?: number, immediate: boolean = true) {
  const apiFunction = useCallback(() => carsService.getFeaturedCars(limit), [limit]);

  return useApi(
    apiFunction,
    [limit],
    immediate
  );
}

// Hook để lấy chi tiết xe
export function useCar(id: string, immediate: boolean = true) {
  const apiFunction = useCallback(() => carsService.getCar(id), [id]);

  return useApi(
    apiFunction,
    [id],
    immediate
  );
}

// Hook để tìm kiếm xe
export function useSearchCars() {
  const searchMutation = useMutation((params: { query: string; filters?: Omit<CarListParams, 'search'> }) =>
    carsService.searchCars(params.query, params.filters)
  );

  const search = useCallback(async (query: string, filters?: Omit<CarListParams, 'search'>) => {
    return await searchMutation.mutate({ query, filters });
  }, [searchMutation.mutate]);

  return {
    search,
    data: searchMutation.data,
    loading: searchMutation.loading,
    error: searchMutation.error,
    reset: searchMutation.reset,
  };
}

// Hook để lấy xe theo loại
export function useCarsByType(type: string, params: Omit<CarListParams, 'type'> = {}, immediate: boolean = true) {
  return usePaginatedApi(
    async (paginationParams) => {
      const result = await carsService.getCarsByType(type, { ...params, ...paginationParams });
      return {
        data: result.cars,
        pagination: result.pagination,
      };
    },
    { ...params, type },
    immediate
  );
}

// Hook để tạo xe mới (Admin)
export function useCreateCar() {
  return useMutation(carsService.createCar);
}

// Hook để cập nhật xe (Admin)
export function useUpdateCar() {
  return useMutation((params: { id: string; data: Partial<CreateCarRequest> }) =>
    carsService.updateCar(params.id, params.data)
  );
}

// Hook để xóa xe (Admin)
export function useDeleteCar() {
  return useMutation(carsService.deleteCar);
}

// Hook để upload hình ảnh xe (Admin)
export function useUploadCarImages() {
  return useMutation((params: { id: string; images: File[] }) =>
    carsService.uploadCarImages(params.id, params.images)
  );
}

// Hook để lấy thương hiệu
export function useBrands(immediate: boolean = true) {
  const apiFunction = useCallback(() => carsService.getBrands(), []);

  return useApi(
    apiFunction,
    [],
    immediate
  );
}

// Hook để lấy năm sản xuất
export function useYears(immediate: boolean = true) {
  const apiFunction = useCallback(() => carsService.getYears(), []);

  return useApi(
    apiFunction,
    [],
    immediate
  );
}

// Hook tổng hợp cho quản lý xe
export function useCarManagement() {
  const createCar = useCreateCar();
  const updateCar = useUpdateCar();
  const deleteCar = useDeleteCar();
  const uploadImages = useUploadCarImages();

  const handleCreateCar = useCallback(async (data: CreateCarRequest) => {
    return await createCar.mutate(data);
  }, [createCar.mutate]);

  const handleUpdateCar = useCallback(async (id: string, data: Partial<CreateCarRequest>) => {
    return await updateCar.mutate({ id, data });
  }, [updateCar.mutate]);

  const handleDeleteCar = useCallback(async (id: string) => {
    return await deleteCar.mutate(id);
  }, [deleteCar.mutate]);

  const handleUploadImages = useCallback(async (id: string, images: File[]) => {
    return await uploadImages.mutate({ id, images });
  }, [uploadImages.mutate]);

  return {
    createCar: {
      mutate: handleCreateCar,
      loading: createCar.loading,
      error: createCar.error,
      data: createCar.data,
      reset: createCar.reset,
    },
    updateCar: {
      mutate: handleUpdateCar,
      loading: updateCar.loading,
      error: updateCar.error,
      data: updateCar.data,
      reset: updateCar.reset,
    },
    deleteCar: {
      mutate: handleDeleteCar,
      loading: deleteCar.loading,
      error: deleteCar.error,
      reset: deleteCar.reset,
    },
    uploadImages: {
      mutate: handleUploadImages,
      loading: uploadImages.loading,
      error: uploadImages.error,
      data: uploadImages.data,
      reset: uploadImages.reset,
    },
  };
}

// Hook để lọc và sắp xếp xe
export function useCarFilters() {
  const applyFilters = useCallback((cars: Car[], filters: {
    search?: string;
    type?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    sortBy?: 'price' | 'name' | 'year' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) => {
    let filteredCars = [...cars];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCars = filteredCars.filter(car =>
        car.name.toLowerCase().includes(searchTerm) ||
        car.description.toLowerCase().includes(searchTerm) ||
        car.brand.toLowerCase().includes(searchTerm)
      );
    }

    // Type filter
    if (filters.type) {
      filteredCars = filteredCars.filter(car => car.type === filters.type);
    }

    // Brand filter
    if (filters.brand) {
      filteredCars = filteredCars.filter(car => car.brand === filters.brand);
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      filteredCars = filteredCars.filter(car => car.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredCars = filteredCars.filter(car => car.price <= filters.maxPrice!);
    }

    // Year filter
    if (filters.year) {
      filteredCars = filteredCars.filter(car => car.year === filters.year);
    }

    // Sorting
    if (filters.sortBy) {
      filteredCars.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (filters.sortBy === 'price') {
          aValue = a.price;
          bValue = b.price;
        } else if (filters.sortBy === 'name') {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        } else if (filters.sortBy === 'year') {
          aValue = a.year;
          bValue = b.year;
        } else if (filters.sortBy === 'createdAt') {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else {
          return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return filteredCars;
  }, []);

  return { applyFilters };
}

export default useCars;
