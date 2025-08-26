import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { BasketProvider } from "../contexts/BasketContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Revitalife | Daily Wellness in a Scoop",
  description:
    "Revitalife combines 22 powerful superfoods in a delicious mango-flavored powder. Give your body what it needs to thrive.",
  keywords: [
    "wellness",
    "superfoods",
    "health",
    "nutrition",
    "supplement",
    "green powder",
    "mango",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <BasketProvider>
          <NotificationProvider>
            <AuthProvider>{children}</AuthProvider>
          </NotificationProvider>
        </BasketProvider>
      </body>
    </html>
  );
}
