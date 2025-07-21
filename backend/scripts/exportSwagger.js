const fs = require('fs');
const path = require('path');
const { specs } = require('../config/swagger');

/**
 * Script để export Swagger specification ra file JSON
 * Có thể sử dụng để import vào Postman hoặc các tools khác
 */

const exportSwagger = () => {
  try {
    // Tạo thư mục docs nếu chưa có
    const docsDir = path.join(__dirname, '../docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Export ra file JSON
    const jsonPath = path.join(docsDir, 'swagger.json');
    fs.writeFileSync(jsonPath, JSON.stringify(specs, null, 2));
    console.log(`✅ Exported Swagger spec to: ${jsonPath}`);

    // Export ra file YAML (nếu cần - bỏ qua vì không có js-yaml)
    // const yaml = require('js-yaml');
    // const yamlPath = path.join(docsDir, 'swagger.yaml');
    // fs.writeFileSync(yamlPath, yaml.dump(specs));
    // console.log(`✅ Exported Swagger spec to: ${yamlPath}`);

    // Tạo file README cho docs
    const readmePath = path.join(docsDir, 'README.md');
    const readmeContent = `# API Documentation Files

## Files

- \`swagger.json\` - OpenAPI 3.0 specification in JSON format
- \`swagger.yaml\` - OpenAPI 3.0 specification in YAML format (coming soon)
- \`swagger-guide.md\` - Hướng dẫn sử dụng Swagger UI

## Usage

### Import vào Postman
1. Mở Postman
2. Click "Import"
3. Chọn file \`swagger.json\`
4. Postman sẽ tự động tạo collection với tất cả endpoints

### Sử dụng với các tools khác
- **Insomnia**: Import file \`swagger.json\`
- **VS Code REST Client**: Sử dụng extension OpenAPI
- **Swagger Editor**: Import file \`swagger.yaml\`

## Online Documentation
- Development: http://localhost:8000/api-docs
- Production: https://api.vinfast.com/api-docs

Generated on: ${new Date().toISOString()}
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log(`✅ Created README at: ${readmePath}`);

    console.log('\n🎉 Swagger export completed successfully!');
    console.log('\n📁 Files created:');
    console.log(`   - ${jsonPath}`);
    console.log(`   - ${readmePath}`);

  } catch (error) {
    console.error('❌ Error exporting Swagger spec:', error.message);
    process.exit(1);
  }
};

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  exportSwagger();
}

module.exports = exportSwagger;
