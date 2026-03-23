import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import DisplayTheme from "@/components/DisplayTheme";
import FloatingBook from "@/components/FloatingBook";
import SiteFooter from "@/components/SiteFooter";
import { buildUnsplashImageSrc } from "@/lib/unsplash";

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

const DEFAULT_SHARE_IMAGE = buildUnsplashImageSrc({
  query: "red rocks amphitheatre concert transportation denver colorado",
  src: "/hero/hero-home.jpg",
  alt: "Red Rocks shuttle transportation",
  width: 1200,
  height: 630,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.partyatredrocks.com"),

  title: {
    default: "Red Rocks Shuttle from Denver | $59 Seats + Private SUVs",
    template: "%s | Party at Red Rocks",
  },

  description:
    "Book Red Rocks shuttle transportation from Denver and Golden. Fixed pricing, pickup details before the ride, and a return plan after the show. Shuttle seats from $59/pp or Private SUV from $499.",

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
      "Fixed pricing, pickup details before the ride, and a return plan after the show. Shuttle seats from $59/pp or Private SUV from $499.",
    images: [
      { url: DEFAULT_SHARE_IMAGE, width: 1200, height: 630, alt: "Red Rocks shuttle transportation" },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Red Rocks Shuttle from Denver | $59 Seats + Private SUVs",
    description:
      "Fixed pricing, pickup details before the ride, and a return plan after the show. Shuttle seats from $59/pp or Private SUV from $499.",
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
        <FloatingBook />
      </body>
    </html>
  );
}
