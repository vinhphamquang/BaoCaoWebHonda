# Hướng dẫn chạy Frontend Honda Plus trong Docker

## Giới thiệu

Tài liệu này hướng dẫn cách chạy phần frontend của ứng dụng Honda Plus trong Docker mà không cần phải build toàn bộ ứng dụng. Điều này hữu ích khi bạn chỉ muốn phát triển và kiểm tra giao diện người dùng.

## Yêu cầu

- Docker và Docker Compose đã được cài đặt
- PowerShell (cho Windows) hoặc Terminal (cho macOS/Linux)

## Cách chạy

### Sử dụng script PowerShell (Windows)

```powershell
.\run-frontend.ps1
```

### Sử dụng npm script

```bash
npm run docker:frontend
```

### Sử dụng Docker Compose trực tiếp

```bash
docker-compose -f docker-compose.frontend.yml up -d
```

## Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **MongoDB Express**: http://localhost:8081
  - Username: admin
  - Password: hondaplus2024
- **Redis Commander**: http://localhost:8082

## Dừng ứng dụng

### Sử dụng npm script

```bash
npm run docker:frontend:down
```

### Sử dụng Docker Compose trực tiếp

```bash
docker-compose -f docker-compose.frontend.yml down
```

## Cấu trúc dự án

- `Dockerfile.frontend`: File cấu hình Docker để chạy frontend
- `docker-compose.frontend.yml`: File cấu hình Docker Compose để chạy frontend và các dịch vụ liên quan
- `run-frontend.ps1`: Script PowerShell để chạy frontend trong Docker

## Lưu ý

- Frontend sẽ chạy ở chế độ development, cho phép hot-reload khi bạn thay đổi code
- Các thư mục `src` và `public` được mount vào container, vì vậy bạn có thể chỉnh sửa code mà không cần phải rebuild container
- MongoDB và Redis được khởi động cùng với frontend để đảm bảo ứng dụng hoạt động đầy đủ