export interface Car {
  _id?: string;
  name: string;
  model: string;
  year: number;
  price: number;
  color: string;
  images: string[];
  specifications: {
    engine: string;
    transmission: string;
    fuelType: string;
    seating: number;
    mileage: string;
    safety: string[];
    features: string[];
  };
  description: string;
  category: 'sedan' | 'suv' | 'hatchback' | 'coupe';
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt?: Date;
}

export interface Order {
  _id?: string;
  customerInfo: Customer;
  carId: string;
  car?: Car;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  car: Car;
  quantity: number;
}

export interface FilterOptions {
  model?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  year?: {
    min: number;
    max: number;
  };
  color?: string;
  category?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
