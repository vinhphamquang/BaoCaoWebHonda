import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VinFast - Cửa hàng ô tô điện hàng đầu Việt Nam",
  description: "Khám phá dòng xe điện thông minh VinFast với công nghệ tiên tiến, thiết kế hiện đại và trải nghiệm lái xe tuyệt vời.",
  keywords: "VinFast, xe điện, ô tô điện, xe hơi Việt Nam, VF3, VF5, VF6, VF7, VF8, VF9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Cart />
        </div>
      </body>
    </html>
  );
}
