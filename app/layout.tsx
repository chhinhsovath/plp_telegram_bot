import type { Metadata } from "next";
import { Inter, Hanuman } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const hanuman = Hanuman({ 
  weight: ['100', '300', '400', '700', '900'],
  subsets: ["khmer", "latin"],
  variable: '--font-hanuman'
});

export const metadata: Metadata = {
  title: "PLP Telegram Manager",
  description: "Manage and analyze your Telegram groups",
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${hanuman.variable}`}>
      <body className={hanuman.className}>
        <LanguageProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
