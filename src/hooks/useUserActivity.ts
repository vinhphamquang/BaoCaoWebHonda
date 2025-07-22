'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserActivity {
  favoriteCars: string[];
  viewedCars: string[];
  lastSearches: string[];
}

export const useUserActivity = () => {
  const { user } = useAuth();
  const [favoriteCars, setFavoriteCars] = useState<string[]>([]);
  const [viewedCars, setViewedCars] = useState<string[]>([]);
  const [lastSearches, setLastSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải dữ liệu hoạt động của người dùng từ localStorage khi component được mount
  useEffect(() => {
    if (user) {
      const loadUserActivity = () => {
        try {
          const storedActivity = localStorage.getItem(`userActivity_${user.id}`);
          if (storedActivity) {
            const parsedActivity: UserActivity = JSON.parse(storedActivity);
            setFavoriteCars(parsedActivity.favoriteCars || []);
            setViewedCars(parsedActivity.viewedCars || []);
            setLastSearches(parsedActivity.lastSearches || []);
          }
        } catch (error) {
          console.error('Lỗi khi tải dữ liệu hoạt động người dùng:', error);
        } finally {
          setLoading(false);
        }
      };

      loadUserActivity();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Lưu dữ liệu hoạt động của người dùng vào localStorage khi có thay đổi
  const saveUserActivity = () => {
    if (user) {
      try {
        const activityData: UserActivity = {
          favoriteCars,
          viewedCars,
          lastSearches,
        };
        localStorage.setItem(`userActivity_${user.id}`, JSON.stringify(activityData));
      } catch (error) {
        console.error('Lỗi khi lưu dữ liệu hoạt động người dùng:', error);
      }
    }
  };

  // Thêm xe vào danh sách yêu thích
  const addFavoriteCar = (carId: string) => {
    if (!favoriteCars.includes(carId)) {
      const updatedFavorites = [...favoriteCars, carId];
      setFavoriteCars(updatedFavorites);
      setTimeout(() => saveUserActivity(), 0);
    }
  };

  // Xóa xe khỏi danh sách yêu thích
  const removeFavoriteCar = (carId: string) => {
    const updatedFavorites = favoriteCars.filter(id => id !== carId);
    setFavoriteCars(updatedFavorites);
    setTimeout(() => saveUserActivity(), 0);
  };

  // Xóa tất cả xe yêu thích
  const clearFavoriteCars = () => {
    setFavoriteCars([]);
    setTimeout(() => saveUserActivity(), 0);
  };

  // Kiểm tra xem một xe có trong danh sách yêu thích không
  const isFavoriteCar = (carId: string) => {
    return favoriteCars.includes(carId);
  };

  // Thêm xe vào danh sách đã xem
  const addViewedCar = (carId: string) => {
    if (!viewedCars.includes(carId)) {
      // Giới hạn số lượng xe đã xem (ví dụ: 10 xe gần nhất)
      const updatedViewed = [carId, ...viewedCars].slice(0, 10);
      setViewedCars(updatedViewed);
      setTimeout(() => saveUserActivity(), 0);
    }
  };

  // Thêm từ khóa tìm kiếm vào lịch sử
  const addSearchTerm = (term: string) => {
    if (term.trim() && !lastSearches.includes(term)) {
      // Giới hạn số lượng từ khóa tìm kiếm (ví dụ: 5 từ khóa gần nhất)
      const updatedSearches = [term, ...lastSearches].slice(0, 5);
      setLastSearches(updatedSearches);
      setTimeout(() => saveUserActivity(), 0);
    }
  };

  return {
    favoriteCars,
    viewedCars,
    lastSearches,
    loading,
    addFavoriteCar,
    removeFavoriteCar,
    clearFavoriteCars,
    isFavoriteCar,
    addViewedCar,
    addSearchTerm,
  };
};