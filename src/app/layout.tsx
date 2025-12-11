import type { Metadata } from "next";
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
  title: "Tomokichi Globe & Story",
  description: "A 3D travel log application",
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
            <main className="relative z-10 pointer-events-none">
               {children}
            </main>
        </MapProvider>
      </body>
    </html>
  );
}
