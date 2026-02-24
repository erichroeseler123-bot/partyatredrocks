import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import DisplayTheme from "@/components/DisplayTheme";
import FloatingBook from "@/components/FloatingBook";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.partyatredrocks.com"),

  title: {
    default: "Red Rocks Shuttle from Denver | $59 Seats + Private SUVs",
    template: "%s | Party at Red Rocks",
  },

  description:
    "Book reliable Red Rocks shuttle transportation from Denver. Fixed pricing, pro drivers, and guaranteed post-show return. Shuttle seats from $59/pp or Private Suburban from $499.",

  alternates: { canonical: "/" },

  keywords: [
    "Red Rocks shuttle",
    "Red Rocks transportation",
    "Red Rocks shuttle from Denver",
    "Red Rocks concert shuttle",
    "Denver to Red Rocks shuttle",
    "Red Rocks private car",
    "Red Rocks SUV",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Party at Red Rocks",
    title: "Red Rocks Shuttle from Denver | $59 Seats + Private SUVs",
    description:
      "Fixed pricing, professional drivers, and guaranteed post-show return. Shuttle seats from $59/pp or Private Suburban from $499.",
    images: [
      { url: "/hero/hero-home.jpg", width: 1200, height: 630, alt: "Red Rocks shuttle transportation" },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle from Denver | $59 Seats + Private SUVs",
    description:
      "Fixed pricing, professional drivers, and guaranteed post-show return. Shuttle seats from $59/pp or Private Suburban from $499.",
    images: ["/hero/hero-home.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-default">
        <DisplayTheme />
        <SiteNav />
        {children}
        <FloatingBook />
      </body>
    </html>
  );
}
