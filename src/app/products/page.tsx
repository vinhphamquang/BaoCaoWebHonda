'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { useCars, useCarFilters } from '@/hooks/useCars';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000000 });
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Memoize params để tránh infinite re-render
  const carsParams = useMemo(() => ({
    page: 1,
    limit: 50, // Get more cars for filtering
  }), []);

  // Fetch cars from API
  const { data: carsData, loading, error } = useCars(carsParams);

  const { applyFilters } = useCarFilters();

  const filteredCars = useMemo(() => {
    if (!carsData) return [];

    return applyFilters(carsData, {
      search: searchTerm,
      type: selectedType !== 'all' ? selectedType : undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: sortBy === 'name' ? 'name' :
             sortBy === 'price-low' ? 'price' :
             sortBy === 'price-high' ? 'price' :
             sortBy === 'year' ? 'year' : 'name',
      sortOrder: sortBy === 'price-high' ? 'desc' : 'asc',
    });
  }, [carsData, searchTerm, selectedType, priceRange, sortBy, applyFilters]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setPriceRange({ min: 0, max: 2000000000 });
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm VinFast
          </h1>
          <p className="text-lg text-gray-600">
            Khám phá dòng xe điện thông minh với công nghệ tiên tiến
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Bộ lọc
                </h2>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tìm kiếm
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm xe..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại xe
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả</option>
                    <option value="electric">Xe điện</option>
                    <option value="hybrid">Xe hybrid</option>
                    <option value="gasoline">Xe xăng</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá (VNĐ)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2000000000"
                      step="50000000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>0đ</span>
                      <span>{(priceRange.max / 1000000).toFixed(0)}M đ</span>
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Tên A-Z</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                    <option value="year">Năm mới nhất</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                {loading ? 'Đang tải...' : `Hiển thị ${filteredCars.length} sản phẩm`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Lỗi tải dữ liệu
                </h3>
                <p className="text-gray-600 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
                >
                  Thử lại
                </button>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600">
                  Thử điều chỉnh bộ lọc để xem thêm sản phẩm
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <ProductCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
