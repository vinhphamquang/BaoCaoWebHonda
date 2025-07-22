export default function SimpleContact() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Liên hệ Honda Plus</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
          
          <div className="space-y-4">
            <p><strong>Địa chỉ:</strong> 123 Nguyễn Văn Linh, Quận 7, TP.HCM</p>
            <p><strong>Điện thoại:</strong> 1900-1234</p>
            <p><strong>Email:</strong> info@hondashop.vn</p>
            <p><strong>Giờ làm việc:</strong> 8:00 - 18:00 (Thứ 2 - Thứ 6)</p>
          </div>
          
          <div className="mt-8">
            <a href="/" className="text-red-600 hover:text-red-700">← Về trang chủ</a>
          </div>
        </div>
      </div>
    </div>
  );
}