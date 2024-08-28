import { Inter } from "next/font/google";

import SnackbarProvider from "./provider/SnackbarProvider";

import "./globals.css";

// Initialize the Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PlyPicker",
  description: "PlyPicker internship assignment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SnackbarProvider />
        {children}
      </body>
    </html>
  );
}
