export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'vinfast-vf3-ra-mat',
    title: 'VinFast VF 3 chính thức ra mắt với giá 240 triệu đồng',
    excerpt: 'Mẫu xe điện mini VinFast VF 3 đã chính thức được công bố giá bán và mở đặt hàng tại thị trường Việt Nam.',
    content: `
      <p>VinFast VF 3 là mẫu xe điện mini được thiết kế dành riêng cho thị trường đô thị Việt Nam. Với mức giá 240 triệu đồng, VF 3 hứa hẹn sẽ là lựa chọn hấp dẫn cho những khách hàng muốn sở hữu xe điện với chi phí hợp lý.</p>
      
      <h3>Thiết kế nhỏ gọn, phù hợp đô thị</h3>
      <p>VF 3 có kích thước nhỏ gọn với chiều dài chỉ 3.190mm, rất phù hợp cho việc di chuyển trong thành phố. Thiết kế hiện đại với đèn LED toàn bộ tạo điểm nhấn ấn tượng.</p>
      
      <h3>Công nghệ hiện đại</h3>
      <p>Xe được trang bị màn hình cảm ứng 10 inch, hệ thống kết nối thông minh và nhiều tính năng an toàn tiên tiến.</p>
      
      <h3>Hiệu suất vận hành</h3>
      <p>VF 3 có thể di chuyển quãng đường lên đến 210km với một lần sạc đầy, đáp ứng tốt nhu cầu di chuyển hàng ngày trong thành phố.</p>
    `,
    image: '/images/news/vf3-launch.jpg',
    author: 'Nguyễn Văn A',
    publishedAt: '2024-01-15',
    category: 'Sản phẩm',
    tags: ['VF 3', 'xe điện', 'ra mắt'],
    featured: true
  },
  {
    id: 'vinfast-mo-rong-he-thong-sac',
    title: 'VinFast mở rộng hệ thống trạm sạc trên toàn quốc',
    excerpt: 'Hệ thống trạm sạc VinFast sẽ được mở rộng lên 150.000 điểm sạc vào cuối năm 2024.',
    content: `
      <p>VinFast đang đẩy mạnh việc xây dựng hạ tầng sạc để hỗ trợ khách hàng sử dụng xe điện một cách thuận tiện nhất.</p>
      
      <h3>Kế hoạch mở rộng</h3>
      <p>Đến cuối năm 2024, VinFast dự kiến sẽ có 150.000 điểm sạc trên toàn quốc, bao gồm cả sạc nhanh và sạc chậm.</p>
      
      <h3>Công nghệ sạc tiên tiến</h3>
      <p>Các trạm sạc VinFast sử dụng công nghệ sạc nhanh DC, có thể sạc từ 10% lên 70% chỉ trong 31 phút.</p>
    `,
    image: '/images/news/charging-station.jpg',
    author: 'Trần Thị B',
    publishedAt: '2024-01-10',
    category: 'Công nghệ',
    tags: ['trạm sạc', 'hạ tầng', 'xe điện'],
    featured: true
  },
  {
    id: 'vinfast-dat-muc-tieu-xuat-khau',
    title: 'VinFast đặt mục tiêu xuất khẩu 50.000 xe trong năm 2024',
    excerpt: 'VinFast tiếp tục mở rộng thị trường quốc tế với kế hoạch xuất khẩu tham vọng.',
    content: `
      <p>VinFast đã đặt ra mục tiêu xuất khẩu 50.000 xe điện ra thị trường quốc tế trong năm 2024, tập trung vào các thị trường Bắc Mỹ và châu Âu.</p>
      
      <h3>Thị trường trọng điểm</h3>
      <p>Mỹ và Canada là hai thị trường chính mà VinFast đang tập trung phát triển, với các showroom đã được mở tại nhiều bang.</p>
      
      <h3>Sản phẩm xuất khẩu</h3>
      <p>VF 8 và VF 9 là hai mẫu xe chủ lực được VinFast xuất khẩu, với thiết kế và tính năng phù hợp với thị trường quốc tế.</p>
    `,
    image: '/images/news/export-plan.jpg',
    author: 'Lê Văn C',
    publishedAt: '2024-01-05',
    category: 'Kinh doanh',
    tags: ['xuất khẩu', 'quốc tế', 'VF 8', 'VF 9'],
    featured: false
  },
  {
    id: 'vinfast-hop-tac-cong-nghe',
    title: 'VinFast hợp tác với các đối tác công nghệ hàng đầu thế giới',
    excerpt: 'Những thỏa thuận hợp tác chiến lược giúp VinFast nâng cao chất lượng sản phẩm.',
    content: `
      <p>VinFast đã ký kết nhiều thỏa thuận hợp tác với các đối tác công nghệ hàng đầu thế giới để phát triển xe điện thông minh.</p>
      
      <h3>Đối tác công nghệ</h3>
      <p>VinFast hợp tác với Samsung SDI cho pin xe điện, Magna cho sản xuất, và nhiều đối tác khác cho các công nghệ tiên tiến.</p>
      
      <h3>Lợi ích cho khách hàng</h3>
      <p>Những hợp tác này giúp VinFast cung cấp sản phẩm chất lượng cao với công nghệ tiên tiến nhất cho khách hàng Việt Nam.</p>
    `,
    image: '/images/news/partnership.jpg',
    author: 'Phạm Thị D',
    publishedAt: '2024-01-01',
    category: 'Công nghệ',
    tags: ['hợp tác', 'công nghệ', 'đối tác'],
    featured: false
  }
];

export const getNewsById = (id: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.id === id);
};

export const getFeaturedNews = (): NewsArticle[] => {
  return newsArticles.filter(article => article.featured);
};

export const getNewsByCategory = (category: string): NewsArticle[] => {
  return newsArticles.filter(article => article.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(newsArticles.map(article => article.category))];
};
