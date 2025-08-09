import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Inter fontunu tanımla
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Askıda Forma - Forma Kardeşliği',
  description: 'Bir formayla binlerce çocuğun hayaline dokun.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}