import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Private Red Rocks Ride Plan | Party at Red Rocks",
  description:
    "Choose your Private Suburban ($499) or Private Van ($699), set your concert date and pickup window, and continue directly to checkout.",
  alternates: { canonical: "https://www.partyatredrocks.com/quick-red-rocks" },
  robots: { index: false, follow: true },
};

export default function QuickRedRocksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
