import type { Metadata } from "next";
import {
  SUBURBAN_ALL_IN_TOTAL_LABEL,
  SUBURBAN_ITEMIZED_LABEL,
  VAN_ALL_IN_TOTAL_LABEL,
  VAN_ITEMIZED_LABEL,
} from "@/lib/rideCatalog";

export const metadata: Metadata = {
  title: "Build Your Private Red Rocks Ride Plan | Party at Red Rocks",
  description:
    `Choose your Private Suburban (${SUBURBAN_ALL_IN_TOTAL_LABEL} total: ${SUBURBAN_ITEMIZED_LABEL}) or Private Van (${VAN_ALL_IN_TOTAL_LABEL} total: ${VAN_ITEMIZED_LABEL}), set your concert date and pickup window, and continue directly to checkout.`,
  alternates: { canonical: "https://www.partyatredrocks.com/quick-red-rocks" },
  robots: { index: false, follow: true },
};

export default function QuickRedRocksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
