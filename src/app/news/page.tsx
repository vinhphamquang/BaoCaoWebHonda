'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { newsArticles, getCategories } from '@/data/news';
import { Calendar, User, Tag, Search } from 'lucide-react';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = getCategories();

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tin tức VinFast
          </h1>
          <p className="text-lg text-gray-600">
            Cập nhật những thông tin mới nhất về VinFast và ngành xe điện
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm tin tức..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="lg:w-3/4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy tin tức
                </h3>
                <p className="text-gray-600">
                  Thử điều chỉnh bộ lọc để xem thêm tin tức
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Article */}
                {filteredArticles.find(article => article.featured) && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <Image
                          src="/images/placeholder-car.jpg"
                          alt={filteredArticles.find(article => article.featured)!.title}
                          width={600}
                          height={300}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            Nổi bật
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          <Link 
                            href={`/news/${filteredArticles.find(article => article.featured)!.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {filteredArticles.find(article => article.featured)!.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">
                          {filteredArticles.find(article => article.featured)!.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(filteredArticles.find(article => article.featured)!.publishedAt)}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {filteredArticles.find(article => article.featured)!.author}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.filter(article => !article.featured).map((article) => (
                    <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <Image
                        src="/images/placeholder-car.jpg"
                        alt={article.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link 
                            href={`/news/${article.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(article.publishedAt)}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {article.author}
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <Tag className="h-3 w-3 mr-1 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs text-gray-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
