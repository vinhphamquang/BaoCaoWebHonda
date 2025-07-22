// Script để test tất cả các trang chính
const pages = [
  'http://localhost:3000',
  'http://localhost:3000/cars',
  'http://localhost:3000/about',
  'http://localhost:3000/contact',
  'http://localhost:3000/cart',
  'http://localhost:3000/api/cars',
  'http://localhost:3000/api/seed'
];

async function testPage(url) {
  try {
    const response = await fetch(url);
    const status = response.status;
    const statusText = response.statusText;
    
    console.log(`✅ ${url} - ${status} ${statusText}`);
    return { url, status, success: status < 400 };
  } catch (error) {
    console.log(`❌ ${url} - Error: ${error.message}`);
    return { url, status: 'ERROR', success: false, error: error.message };
  }
}

async function testAllPages() {
  console.log('🧪 Testing Honda Shop pages...\n');
  
  const results = [];
  for (const page of pages) {
    const result = await testPage(page);
    results.push(result);
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All pages are working correctly!');
  } else {
    console.log('\n⚠️  Some pages have issues. Check the logs above.');
  }
}

// Chạy test nếu file được execute trực tiếp
if (typeof window === 'undefined') {
  testAllPages();
}

module.exports = { testAllPages, testPage };
