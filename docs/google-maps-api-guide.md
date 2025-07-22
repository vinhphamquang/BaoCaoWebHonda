# Hướng dẫn tạo và sử dụng Google Maps API Key

Tài liệu này hướng dẫn cách tạo và sử dụng Google Maps API Key cho ứng dụng Honda Shop.

## Tại sao cần Google Maps API Key?

Google Maps API Key là một chuỗi ký tự duy nhất được sử dụng để xác thực các yêu cầu liên quan đến Google Maps. Kể từ tháng 7/2018, Google yêu cầu tất cả các ứng dụng sử dụng Google Maps phải có API Key và liên kết với tài khoản thanh toán.

## Các bước tạo Google Maps API Key

### Bước 1: Tạo dự án mới trên Google Cloud Platform

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google của bạn
3. Nhấp vào "Select a project" ở góc trên bên phải
4. Nhấp vào "NEW PROJECT"
5. Đặt tên cho dự án (ví dụ: "Honda Shop Maps")
6. Nhấp vào "CREATE"

### Bước 2: Kích hoạt các API cần thiết

1. Từ trang chính của dự án, chọn "APIs & Services" > "Library"
2. Tìm kiếm và kích hoạt các API sau:
   - Maps JavaScript API
   - Places API (nếu bạn cần tính năng tìm kiếm địa điểm)
   - Geocoding API (nếu bạn cần chuyển đổi địa chỉ thành tọa độ)
3. Nhấp vào từng API và chọn "ENABLE"

### Bước 3: Tạo API Key

1. Từ trang chính của dự án, chọn "APIs & Services" > "Credentials"
2. Nhấp vào "CREATE CREDENTIALS" > "API key"
3. Một cửa sổ hiện ra với API Key mới của bạn. Sao chép key này.

### Bước 4: Giới hạn API Key (Quan trọng cho bảo mật)

1. Sau khi tạo API Key, nhấp vào "RESTRICT KEY"
2. Trong phần "Application restrictions", chọn "HTTP referrers (web sites)"
3. Thêm các domain của ứng dụng (ví dụ: `*.hondashop.vn/*` và `https://hondashop.vn/*`)
4. Trong phần "API restrictions", chọn "Restrict key"
5. Chọn các API đã kích hoạt ở Bước 2
6. Nhấp vào "SAVE"

## Cách sử dụng API Key trong ứng dụng

### Trong trang liên hệ (Contact Page)

1. Mở file `src/app/contact/page.tsx`
2. Tìm dòng có chứa `googleMapsApiKey="YOUR_API_KEY_HERE"`
3. Thay thế `YOUR_API_KEY_HERE` bằng API Key bạn đã tạo

```tsx
<LoadScript googleMapsApiKey="YOUR_ACTUAL_API_KEY_HERE">
  <GoogleMap
    mapContainerStyle={mapContainerStyle}
    center={showroomLocation}
    zoom={15}
  >
    <Marker position={showroomLocation} />
  </GoogleMap>
</LoadScript>
```

## Lưu ý quan trọng

- **Bảo mật API Key**: Không chia sẻ API Key của bạn công khai. Luôn giới hạn key bằng cách thiết lập các hạn chế như đã hướng dẫn ở Bước 4.
- **Giới hạn sử dụng**: Google Maps Platform có một số lượng yêu cầu miễn phí mỗi tháng. Sau khi vượt quá giới hạn này, bạn sẽ bị tính phí.
- **Theo dõi sử dụng**: Thường xuyên kiểm tra bảng điều khiển Google Cloud để theo dõi việc sử dụng API và chi phí phát sinh.

## Tài liệu tham khảo

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)
- [@react-google-maps/api Documentation](https://react-google-maps-api-docs.netlify.app/)