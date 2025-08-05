import type { Metadata } from "next";
import { Inter, Hanuman } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${hanuman.variable}`}>
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
