'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface Car {
  _id: string;
  name: string;
  model: string;
  price: number;
  images: string[];
  category: string;
}

interface AvailableSlot {
  time: string;
  label: string;
  available: boolean;
}

export default function TestDrivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  // Get car ID and name from URL params
  const carId = searchParams.get('carId');
  const carName = searchParams.get('carName');
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    customerAddress: '',
    carId: carId || '',
    preferredDate: '',
    preferredTime: '',
    alternativeDate: '',
    alternativeTime: '',
    message: '',
    experience: 'experienced' as 'first-time' | 'experienced' | 'expert',
    licenseNumber: '',
    showroom: 'Honda Quận 1'
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  // Data state
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Constants
  const showrooms = [
    'Honda Quận 1',
    'Honda Quận 3', 
    'Honda Quận 7',
    'Honda Thủ Đức',
    'Honda Bình Thạnh',
    'Honda Gò Vấp'
  ];

  const experienceOptions = [
    { value: 'first-time', label: 'Lần đầu lái xe Honda' },
    { value: 'experienced', label: 'Đã có kinh nghiệm lái xe' },
    { value: 'expert', label: 'Rất có kinh nghiệm' }
  ];

  // Load car info if carId is provided
  useEffect(() => {
    if (carId) {
      fetchCarInfo(carId);
    } else {
      // Load available cars if no specific car is selected
      fetchAvailableCars();
    }
  }, [carId]);

  // Load available slots when date/showroom changes
  useEffect(() => {
    if (formData.preferredDate && formData.showroom) {
      fetchAvailableSlots();
    }
  }, [formData.preferredDate, formData.showroom]);

  const fetchCarInfo = async (id: string) => {
    try {
      const response = await fetch(`/api/cars/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedCar(data.data);
        setFormData(prev => ({
          ...prev,
          carId: id
        }));
      }
    } catch (error) {
      console.error('Error fetching car info:', error);
    }
  };

  const fetchAvailableCars = async () => {
    setLoadingCars(true);
    try {
      const response = await fetch('/api/cars?limit=20');
      const data = await response.json();
      if (data.success) {
        setAvailableCars(data.data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoadingCars(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!formData.preferredDate || !formData.showroom) return;
    
    setLoadingSlots(true);
    try {
      const response = await fetch(
        `/api/test-drive/available-slots?showroom=${encodeURIComponent(formData.showroom)}&date=${formData.preferredDate}`
      );
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.data.availableSlots);
      } else {
        setError(data.error || 'Lỗi khi tải khung giờ');
      }
    } catch (error) {
      setError('Lỗi khi tải khung giờ');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateStep1 = () => {
    console.log('Validating step 1, formData:', formData); // Debug log
    
    if (!formData.customerName.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.customerEmail.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!formData.customerPhone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!formData.carId) {
      setError('Vui lòng chọn xe muốn lái thử');
      return false;
    }
    console.log('Validation passed!'); // Debug log
    return true;
  };

  const validateStep2 = () => {
    if (!formData.showroom) {
      setError('Vui lòng chọn showroom');
      return false;
    }
    if (!formData.preferredDate) {
      setError('Vui lòng chọn ngày lái thử');
      return false;
    }
    if (!formData.preferredTime) {
      setError('Vui lòng chọn giờ lái thử');
      return false;
    }
    if (!formData.experience) {
      setError('Vui lòng chọn mức độ kinh nghiệm');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/test-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Có lỗi xảy ra khi đặt lịch');
      }
    } catch (error) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đặt lịch thành công!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đăng ký lái thử xe Honda. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/cars')}
              className="w-full gradient-primary"
            >
              Xem thêm xe Honda
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            href="/cars" 
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách xe
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              HONDA
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">Plus</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt lịch lái thử
          </h1>
          <p className="text-gray-600">
            Trải nghiệm xe Honda yêu thích của bạn hoàn toàn miễn phí
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex-1 border-t-2 ${step >= 1 ? 'border-red-500' : 'border-gray-300'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'} mx-2 font-semibold`}>
                1
              </div>
              <div className={`flex-1 border-t-2 ${step >= 2 ? 'border-red-500' : 'border-gray-300'}`}></div>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'} mx-2 font-semibold`}>
                2
              </div>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-sm font-medium text-gray-700">Thông tin cá nhân</span>
              <span className="text-sm font-medium text-gray-700">Chọn lịch hẹn</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Selected Car Display */}
                {(selectedCar || carName) && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Car className="h-5 w-5 mr-2 text-red-600" />
                      Xe đã chọn
                    </h3>
                    <div className="flex items-center space-x-4">
                      {selectedCar?.images?.[0] && (
                        <img 
                          src={selectedCar.images[0]} 
                          alt={selectedCar.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {selectedCar?.name || carName || 'Đang tải thông tin xe...'}
                        </p>
                        {selectedCar ? (
                          <>
                            <p className="text-sm text-gray-600">{selectedCar.model} • {selectedCar.category}</p>
                            <p className="text-sm font-semibold text-red-600">
                              {selectedCar.price.toLocaleString('vi-VN')} VND
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">Đang tải thông tin chi tiết...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập họ và tên của bạn"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ của bạn (tùy chọn)"
                  />
                </div>

                {/* Car Selection (if not pre-selected) */}
                {!selectedCar && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xe muốn lái thử *
                    </label>
                    <div className="relative">
                      {loadingCars ? (
                        <div className="flex items-center p-2">
                          <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                          <span>Đang tải danh sách xe...</span>
                        </div>
                      ) : (
                        <select
                          name="carId"
                          value={formData.carId}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Chọn xe muốn lái thử</option>
                          {availableCars.map(car => (
                            <option key={car._id} value={car._id}>
                              {car.name} - {car.model} ({car.price.toLocaleString('vi-VN')} VND)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Schedule Selection */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Showroom Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn showroom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="showroom"
                      value={formData.showroom}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      {showrooms.map(showroom => (
                        <option key={showroom} value={showroom}>{showroom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày lái thử *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Available Time Slots */}
                {formData.preferredDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn giờ lái thử *
                    </label>
                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                        <span className="ml-2 text-gray-600">Đang tải khung giờ...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableSlots.map(slot => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, preferredTime: slot.time }))}
                            className={`p-3 border rounded-lg text-center transition-colors ${
                              formData.preferredTime === slot.time
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {slot.time}
                            </div>
                            <div className="text-xs text-gray-600">{slot.label}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {availableSlots.length === 0 && !loadingSlots && formData.preferredDate && (
                      <p className="text-center text-gray-500 py-4">
                        Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.
                      </p>
                    )}
                  </div>
                )}

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh nghiệm lái xe *
                  </label>
                  <div className="space-y-2">
                    {experienceOptions.map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          value={option.value}
                          checked={formData.experience === option.value}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số bằng lái xe
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nhập số bằng lái (tùy chọn)"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Có gì bạn muốn chúng tôi biết? (tùy chọn)"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Quay lại
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Đang xử lý...
                      </div>
                    ) : (
                      'Đặt lịch lái thử'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}