import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Honda Shop - Đại lý Honda chính hãng",
  description: "Mua xe Honda chính hãng với giá tốt nhất. Showroom Honda uy tín với đầy đủ các dòng xe: Civic, Accord, CR-V, City, HR-V, Pilot.",
  keywords: "Honda, xe Honda, mua xe Honda, Honda Civic, Honda Accord, Honda CR-V, Honda City, Honda HR-V, Honda Pilot, đại lý Honda",
  authors: [{ name: "Honda Shop" }],
  robots: "index, follow",
  openGraph: {
    title: "Honda Shop - Đại lý Honda chính hãng",
    description: "Mua xe Honda chính hãng với giá tốt nhất. Showroom Honda uy tín với đầy đủ các dòng xe.",
    type: "website",
    locale: "vi_VN",
    siteName: "Honda Shop",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
