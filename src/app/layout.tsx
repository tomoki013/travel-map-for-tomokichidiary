import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
import { Noto_Sans_JP, Playfair_Display } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tomokichi Globe & Story | 旅の地球儀",
    template: "%s | Tomokichi Globe & Story",
  },
  description:
    "ともきちのブログ「ともきちの旅行日記」と連動した3D地球儀アプリ。訪れた国や都市、旅のルートを美しい3Dマップで可視化し、没入感のある旅行体験をお届けします。",
  authors: [{ name: "ともきち" }],
  openGraph: {
    title: "Tomokichi Globe & Story | 旅の地球儀",
    description:
      "ともきちの旅行記録を3D地球儀で体験。世界中の旅先への没入感あるビジュアルツアーをお楽しみください。",
    url: "https://map.tomokichidiary.com/",
    siteName: "Tomokichi Globe & Story",
    type: "website",
    images: [
      {
        url: "favicon.ico",
        width: 1200,
        height: 630,
        alt: "Tomokichi Globe & Story - 3D Travel Map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tomokichi Globe & Story | 旅の地球儀",
    description:
      "ともきちの旅行記録を3D地球儀で体験。世界中の旅先への没入感あるビジュアルツアーをお楽しみください。",
    images: ["favicon.ico"],
  },
  metadataBase: new URL("https://map.tomokichidiary.com"),
};

import { MapProvider } from "@/contexts/MapContext";
import { GlobalMap } from "@/components/map/GlobalMap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansJP.variable} ${playfairDisplay.variable} antialiased bg-transparent text-black font-sans`}
      >
        <MapProvider>
          <div className="fixed inset-0 z-0 w-full h-full">
            <GlobalMap />
          </div>
          <main className="relative z-10 pointer-events-none">{children}</main>
        </MapProvider>
      </body>
    </html>
  );
}
