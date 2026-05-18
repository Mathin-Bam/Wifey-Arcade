import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Naizbooo: The Birthday Arcade",
  description: "A premium animated birthday arcade experience.",
};

export const viewport: Viewport = {
  themeColor: "#FFDDF4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import FloatingStickers from "@/components/FloatingStickers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
        <FloatingStickers />
        {children}
      </body>
    </html>
  );
}
