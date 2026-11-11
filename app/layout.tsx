import type { CSSProperties } from "react";
import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import DisplayTheme from "@/components/DisplayTheme";
import SiteFooter from "@/components/SiteFooter";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { pageVisuals } from "@/lib/pageVisuals";

const FONT_VARIABLES = {
  "--font-heading": '"Montserrat", "Avenir Next", "Segoe UI", sans-serif',
  "--font-accent": '"Playfair Display", Georgia, serif',
} as CSSProperties;

const DEFAULT_SHARE_IMAGE = pageVisuals.layout.shareImage;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.partyatredrocks.com"),

  title: {
    default: "Red Rocks Shuttle & Private Group Transportation | Party at Red Rocks",
    template: "%s | Party at Red Rocks",
  },

  description: BOOKING_COPY.meta.layoutDescription,

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
    title: "Red Rocks Shuttle & Private Group Transportation | Party at Red Rocks",
    description: BOOKING_COPY.meta.layoutDescription,
    images: [
      { url: DEFAULT_SHARE_IMAGE, width: 1200, height: 630, alt: "Private Red Rocks transportation" },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle & Private Group Transportation | Party at Red Rocks",
    description: BOOKING_COPY.meta.layoutDescription,
    images: [DEFAULT_SHARE_IMAGE],
  },

  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Playfair+Display:wght@600;700&display=swap"
        />
      </head>
      <body style={FONT_VARIABLES} className="bg-surface text-default">
        <DisplayTheme />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
