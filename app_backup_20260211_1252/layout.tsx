import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: {
    default: "Red Rocks Shuttle from Denver & Golden | $59 per person | Party at Red Rocks",
    template: "%s | Party at Red Rocks",
  },
  description:
    "Book $59 per-person Red Rocks shuttle seats from Downtown Denver or Golden. Direct Top Circle drop-off. Guaranteed post-show return. Private Suburban ($499) and Any-Venue Suburban ($250 up to 7) available.",
  alternates: {
    canonical: "https://www.partyatredrocks.com/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
