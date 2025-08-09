import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Inter fontunu tanımla
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Font ağırlıklarını açıkça belirt
  variable: '--font-inter', // CSS değişkeni olarak tanımla (isteğe bağlı)
  display: 'swap', // Font yüklenirken metin görünürlüğünü optimize et
});

export const metadata: Metadata = {
  title: 'Askıda Forma - Forma Kardeşliği',
  description: 'Bir formayla binlerce çocuğun hayaline dokun.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Font preload için ek optimizasyon (isteğe bağlı) */}
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}