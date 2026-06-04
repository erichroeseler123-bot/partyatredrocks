import { redirect } from "next/navigation";

export const metadata = {
  title: "Book Private Suburban to Red Rocks | Party at Red Rocks",
  description:
    "Book private Suburban transportation to Red Rocks with direct pickup and reliable return after the show.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/book/red-rocks-amphitheatre/private/suv",
  },
};

export default function BookingPage() {
  redirect("/book/red-rocks-amphitheatre/private/suv");
}
