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
      <body className={`${headingFont.variable} ${bodyAccentFont.variable} bg-surface text-default`}>
        <DisplayTheme />
        <SiteNav />
        <aside
          role="status"
          aria-label="Red Rocks transportation availability"
          style={{
            margin: "0 auto 16px",
            padding: "14px 20px",
            width: "calc(100% - 32px)",
            maxWidth: "1200px",
            boxSizing: "border-box",
            border: "2px solid #d49315",
            borderRadius: "12px",
            background: "#fff4ce",
            color: "#30220b",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          <strong>Sold out: October 19 &amp; 20, 2026.</strong>{" "}
          All Red Rocks transportation is fully booked on these dates. Please select another date.
        </aside>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
