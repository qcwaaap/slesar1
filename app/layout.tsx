import type { Metadata } from "next";
import { metadata as siteMetadata } from "./metadata";
import "./globals.css";
import localFont from "next/font/local";

// Local fonts to avoid build-time fetching from Google Fonts.
const geistSans = localFont({
  variable: "--font-geist-sans",
  display: "swap",
  src: [
    { path: "../public/fonts/geist-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/geist-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  src: [{ path: "../public/fonts/geist-mono-vf-latin.woff2", weight: "100 900", style: "normal" }],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}