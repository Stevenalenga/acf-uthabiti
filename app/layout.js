import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ClientRootLayout from "./ClientRootLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Africa Childcare Forum",
  description: "Care for All: Building a Global Future for Africa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
