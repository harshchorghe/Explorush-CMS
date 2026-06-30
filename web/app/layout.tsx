import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://explorush.vercel.app"),
  title: {
    default: "Explorush | Interactive Travel Logs & CMS Portal",
    template: "%s | Explorush",
  },
  description: "Discover premium travel journals, interactive map footprints, blogs, and upcoming group tours guided by Harsh Chorghe.",
  keywords: ["travel blogs", "group tours", "interactive travel maps", "Explorush", "Harsh Chorghe"],
  authors: [{ name: "Harsh Chorghe" }],
  creator: "Harsh Chorghe",
  openGraph: {
    title: "Explorush | Interactive Travel Logs & CMS Portal",
    description: "Discover premium travel journals, interactive map footprints, blogs, and upcoming group tours guided by Harsh Chorghe.",
    url: "https://explorush.vercel.app",
    siteName: "Explorush",
    images: [
      {
        url: "/about_me.jpg",
        width: 1200,
        height: 630,
        alt: "Explorush Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explorush | Interactive Travel Logs & CMS Portal",
    description: "Discover premium travel journals, interactive map footprints, blogs, and upcoming group tours guided by Harsh Chorghe.",
    images: ["/about_me.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F4EC] text-[#2A2A2A] font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
