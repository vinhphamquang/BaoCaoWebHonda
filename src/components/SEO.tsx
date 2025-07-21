import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = 'VinFast - Cửa hàng ô tô điện hàng đầu Việt Nam',
  description = 'Khám phá dòng xe điện thông minh VinFast với công nghệ tiên tiến, thiết kế hiện đại và trải nghiệm lái xe tuyệt vời. Đăng ký lái thử miễn phí ngay hôm nay.',
  keywords = 'VinFast, xe điện, ô tô điện, xe hơi Việt Nam, VF3, VF5, VF6, VF7, VF8, VF9, Lux A2.0, Lux SA2.0, lái thử, mua xe điện',
  image = '/images/vinfast-og.jpg',
  url = 'https://vinfast.vn',
  type = 'website'
}: SEOProps) {
  const fullTitle = title.includes('VinFast') ? title : `${title} | VinFast`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="VinFast" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Vietnamese" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="VinFast" />
      <meta property="og:locale" content="vi_VN" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@VinFast" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1e3a8a" />
      <meta name="msapplication-TileColor" content="#1e3a8a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="VinFast" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "VinFast",
            "url": "https://vinfast.vn",
            "logo": "https://vinfast.vn/images/logo.png",
            "description": description,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Số 7, Đường Bằng Lăng 1, Khu đô thị Vinhomes Riverside",
              "addressLocality": "Long Biên",
              "addressRegion": "Hà Nội",
              "addressCountry": "VN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+84-1900-23-23-89",
              "contactType": "customer service",
              "availableLanguage": "Vietnamese"
            },
            "sameAs": [
              "https://www.facebook.com/VinFast",
              "https://www.youtube.com/VinFast",
              "https://www.instagram.com/VinFast"
            ]
          })
        }}
      />
    </Head>
  );
}
