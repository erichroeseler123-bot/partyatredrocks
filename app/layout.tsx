import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import DisplayTheme from "@/components/DisplayTheme";
import SiteFooter from "@/components/SiteFooter";
import { BOOKING_COPY } from "@/lib/bookingCopy";
import { pageVisuals } from "@/lib/pageVisuals";

const headingFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const bodyAccentFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["600", "700"],
  display: "swap",
});

const DEFAULT_SHARE_IMAGE = pageVisuals.layout.shareImage;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.partyatredrocks.com"),

  title: {
    default: "Red Rocks Shuttle & Private Transportation | $399 SUV + $599 Van",
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
    title: "Red Rocks Shuttle & Private Transportation | $399 SUV + $599 Van",
    description: BOOKING_COPY.meta.layoutDescription,
    images: [
      { url: DEFAULT_SHARE_IMAGE, width: 1200, height: 630, alt: "Private Red Rocks transportation" },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle & Private Transportation | $399 SUV + $599 Van",
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
      <body className={`${headingFont.variable} ${bodyAccentFont.variable} bg-surface text-default`}>
        <DisplayTheme />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
