import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getCarImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `/images/${imagePath}`;
}

// Danh sách các đường dẫn ảnh xe có sẵn
const carImagePaths = [
  'cars/img/img/Civic-Type-R-lead.avif',
  'cars/img/img/HONDA-BRV-G.webp',
  'cars/img/img/Honda civic-RS.jpg',
  'cars/img/img/Honda-CR-V-Hybrid.avif',
  'cars/img/img/Honda-Odyssey.png',
  'cars/img/img/Honda-ZR-V.jpg',
  'cars/img/img/Honda_BR-V.jpg',
  'cars/img/img/Honda_CR-v7cho.jpg',
  'cars/img/img/civic-honda.webp',
  'cars/img/img/honda-accord.jpg',
  'cars/img/img/honda-city-G.webp',
  'cars/img/img/honda-city.webp',
  'cars/img/img/honda-civic-G.jpg',
  'cars/img/img/honda-civic.webp',
  'cars/img/img/honda-crv.jpg',
  'cars/img/img/honda-hrv.avif',
  'cars/img/img/honda_city_hatchback.jpg',
  'cars/img/img/honda_type-s.jpg',
  'cars/img/img/hondacity-hatchback.jpg'
];

/**
 * Gán ngẫu nhiên các ảnh xe cho một mẫu xe
 * @param count Số lượng ảnh cần gán (mặc định là 3)
 * @returns Mảng các đường dẫn ảnh ngẫu nhiên
 */
export function getRandomCarImages(count: number = 3): string[] {
  // Tạo bản sao của mảng ảnh để không ảnh hưởng đến mảng gốc
  const availableImages = [...carImagePaths];
  const result: string[] = [];
  
  // Lấy ngẫu nhiên các ảnh từ mảng có sẵn
  for (let i = 0; i < count && availableImages.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    result.push(availableImages[randomIndex]);
    // Xóa ảnh đã chọn để tránh trùng lặp
    availableImages.splice(randomIndex, 1);
  }
  
  return result;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Local Storage helpers
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle storage errors silently
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle storage errors silently
    }
  },
};
