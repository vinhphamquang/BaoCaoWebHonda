/**
 * Script để cập nhật đường dẫn hình ảnh cho các mẫu xe trong seedData.ts
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục chứa hình ảnh xe
const carsImagesDir = path.join(__dirname, '../../public/images/cars');

// Đọc danh sách thư mục con (mỗi thư mục đại diện cho một mẫu xe)
const carFolders = fs.readdirSync(carsImagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'img' && dirent.name !== 'default')
  .map(dirent => dirent.name);

console.log('Danh sách thư mục xe:', carFolders);

// Đọc nội dung file seedData.ts
const seedDataPath = path.join(__dirname, './seedData.ts');
let seedDataContent = fs.readFileSync(seedDataPath, 'utf8');

// Hàm để lấy đường dẫn hình ảnh ngẫu nhiên cho một mẫu xe
function getRandomCarImages() {
  // Chọn ngẫu nhiên 3 thư mục xe khác nhau
  const shuffledFolders = [...carFolders].sort(() => 0.5 - Math.random());
  const selectedFolders = shuffledFolders.slice(0, 3);
  
  // Tạo đường dẫn hình ảnh cho mỗi thư mục đã chọn
  return selectedFolders.map(folder => {
    const imageNumber = Math.floor(Math.random() * 3) + 1;
    return `/images/cars/${folder}/${folder}-${imageNumber}.jpg`;
  });
}

// Biểu thức chính quy để tìm mảng images trong seedData.ts
const imagesRegex = /images:\s*\[([^\]]+)\]/g;

// Thay thế tất cả các mảng images bằng mảng mới với đường dẫn hình ảnh ngẫu nhiên
seedDataContent = seedDataContent.replace(imagesRegex, (match) => {
  const randomImages = getRandomCarImages();
  return `images: [
      '${randomImages[0]}',
      '${randomImages[1]}',
      '${randomImages[2]}',
    ]`;
});

// Ghi nội dung đã cập nhật vào file seedData.ts
fs.writeFileSync(seedDataPath, seedDataContent, 'utf8');

console.log('Đã cập nhật đường dẫn hình ảnh cho các mẫu xe trong seedData.ts');