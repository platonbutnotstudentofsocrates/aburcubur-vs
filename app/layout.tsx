import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Archivo_Black, Pixelify_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({ weight: "400", variable: "--font-display", subsets: ["latin", "latin-ext"] });
const body = Space_Grotesk({ variable: "--font-body", subsets: ["latin", "latin-ext"] });
const pixel = Pixelify_Sans({ variable: "--font-pixel", subsets: ["latin", "latin-ext"] });

const title = "Abur Cubur VS";
const description = "Hangisi kazanır? Tek tıkla oy ver, Türkiye ne diyor gör.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_ENV === "production" ? "https://aburcubur.online" : "http://localhost:3000"),
  title,
  description,
  openGraph: { title, description, locale: "tr_TR", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#fff6e0" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} ${pixel.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
