import type { Metadata } from "next";
import HomeSections from "@/components/home/HomeSections";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Party at Red Rocks | Concert Shuttles + Private SUVs",
  description:
    "Fixed-price concert shuttles and private SUVs from Denver to Red Rocks and major Colorado venues. No surge. Clear pickup. Guaranteed ride home.",
  alternates: { canonical: "https://www.partyatredrocks.com/" },
};

export default async function HomePage() {
  return <HomeSections />;
}
