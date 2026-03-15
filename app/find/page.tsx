import { redirect } from "next/navigation";

function qp(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export const metadata = {
  title: "Find Your Ride | Party at Red Rocks",
  description: "Redirecting to the current booking flow for Red Rocks ride options.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  params.set("venue", "red-rocks-amphitheatre");

  const date = qp(sp, "date");
  const qty = qp(sp, "qty");

  if (date) params.set("date", date);
  if (qty) params.set("qty", qty);

  redirect(`/book?${params.toString()}`);
}
