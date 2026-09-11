import type { Metadata } from 'next';
import { Geist, Geist_Mono, Press_Start_2P, VT323, Lora, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin', 'vietnamese'],
  variable: '--font-vt323',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lora',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Met — A Tiny Love Story',
  description: 'A cozy 2D pixel-art love story game',
  icons: {
    icon: '/assets/others/rose-item.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} ${vt323.variable} ${lora.variable} ${beVietnamPro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
