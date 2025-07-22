'use client';

import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  className?: string;
}

export interface SearchFilters {
  query: string;
  model: string;
  category: string;
  color: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  seating: string;
  fuelType: string;
  transmission: string;
  sortBy: string;
  sortOrder: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  initialFilters = {},
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    model: '',
    category: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    seating: '',
    fuelType: '',
    transmission: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  const models = ['Civic', 'Accord', 'CR-V', 'City', 'HR-V', 'Pilot', 'Brio', 'Jazz', 'Insight', 'BR-V'];
  const categories = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'coupe', label: 'Coupe' }
  ];
  const colors = [
    'Trắng Ngọc Trai', 'Đen Ánh Kim', 'Bạc Ánh Kim', 'Đỏ Ánh Kim',
    'Xanh Dương Ánh Kim', 'Xám Ánh Kim', 'Nâu Ánh Kim'
  ];
  const fuelTypes = ['Xăng', 'Dầu', 'Hybrid', 'Điện'];
  const transmissions = ['Số sàn', 'Số tự động', 'CVT', 'DCT', '6MT', '10AT'];
  const seatingOptions = ['2', '4', '5', '7', '8'];

  const priceRanges = [
    { label: 'Dưới 500 triệu', min: '0', max: '500000000' },
    { label: '500 triệu - 800 triệu', min: '500000000', max: '800000000' },
    { label: '800 triệu - 1.2 tỷ', min: '800000000', max: '1200000000' },
    { label: '1.2 tỷ - 2 tỷ', min: '1200000000', max: '2000000000' },
    { label: 'Trên 2 tỷ', min: '2000000000', max: '' }
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá thấp đến cao' },
    { value: 'price-desc', label: 'Giá cao đến thấp' },
    { value: 'year-desc', label: 'Năm mới nhất' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' }
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceRangeSelect = (range: typeof priceRanges[0]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min,
      maxPrice: range.max
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: '',
      model: '',
      category: '',
      color: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      seating: '',
      fuelType: '',
      transmission: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    return value !== '';
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Tìm kiếm nâng cao</h3>
            {hasActiveFilters && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Có bộ lọc
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Mở rộng <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Input - Always visible */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm xe Honda..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Quick Price Ranges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá phổ biến
            </label>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handlePriceRangeSelect(range)}
                  className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                    filters.minPrice === range.min && filters.maxPrice === range.max
                      ? 'bg-red-100 border-red-300 text-red-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 1: Model, Category, Seating */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dòng xe
              </label>
              <select
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tất cả dòng xe</option>
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại xe
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tất cả loại xe</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số chỗ ngồi
              </label>
              <select
                value={filters.seating}
                onChange={(e) => handleFilterChange('seating', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tất cả số chỗ</option>
                {seatingOptions.map(seats => (
                  <option key={seats} value={seats}>{seats} chỗ</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng giá tùy chỉnh
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Giá từ (VND)"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Giá đến (VND)"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3: Year Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm sản xuất
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Từ năm"
                value={filters.minYear}
                onChange={(e) => handleFilterChange('minYear', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Đến năm"
                value={filters.maxYear}
                onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 4: Color, Fuel Type, Transmission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu sắc
              </label>
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange('color', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tất cả màu sắc</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại nhiên liệu
              </label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tất cả loại nhiên liệu</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hộp số
              </label>
              <select
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Tất cả loại hộp số</option>
                {transmissions.map(trans => (
                  <option key={trans} value={trans}>{trans}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp kết quả
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="w-full md:w-64 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button onClick={handleSearch} className="flex-1 sm:flex-none">
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;