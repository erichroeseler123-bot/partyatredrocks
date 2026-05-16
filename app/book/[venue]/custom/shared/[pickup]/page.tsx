import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RezdyBookingEmbed } from "@/components/booking/rezdy/RezdyBookingEmbed";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

type PageProps = {
  params: Promise<{ venue: string; pickup: string }>;
  searchParams: Promise<HandoffSearchParams>;
};

const REZDY_SHARED_PRODUCTS = {
  denver: {
    pickup: "denver",
    title: "Book Denver to Red Rocks Shuttle",
    subtitle:
      "Reserve the Denver shared shuttle to Red Rocks through the temporary Rezdy widget. Return transportation after the show is part of the shuttle path.",
    productId: "714441",
    productName: "Denver to Red Rocks Shuttle",
    rezdyUrl: "https://gosnotransportation58.rezdy.com/714441/denver-to-red-rocks-shuttle?iframe=true",
  },
  golden: {
    pickup: "golden",
    title: "Book Westside Shuttle to Red Rocks",
    subtitle:
      "Reserve the Golden westside shared shuttle to Red Rocks through the temporary Rezdy widget. Return transportation after the show is part of the shuttle path.",
    productId: "714443",
    productName: "Westside Shuttle to Red Rocks",
    rezdyUrl: "https://gosnotransportation58.rezdy.com/714443/westside-shuttle-to-red-rocks?iframe=true",
  },
} as const;

type RezdyPickup = keyof typeof REZDY_SHARED_PRODUCTS;

function isRezdyPickup(pickup: string): pickup is RezdyPickup {
  return pickup === "denver" || pickup === "golden";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { venue, pickup } = await params;
  if (venue !== "red-rocks-amphitheatre" || !isRezdyPickup(pickup)) return {};

  const product = REZDY_SHARED_PRODUCTS[pickup];
  const canonical = `https://www.partyatredrocks.com/book/${venue}/custom/shared/${pickup}`;
  return {
    title: `${product.title} | Party at Red Rocks`,
    description: product.subtitle,
    alternates: { canonical },
  };
}

export default async function SharedRezdyPickupPage({ params }: PageProps) {
  const { venue, pickup } = await params;
  if (venue !== "red-rocks-amphitheatre" || !isRezdyPickup(pickup)) notFound();

  const product = REZDY_SHARED_PRODUCTS[pickup];
  const page = `/book/${venue}/custom/shared/${pickup}`;

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1120px]">
        <RezdyBookingEmbed
          page={page}
          surface="shared_booking"
          title={product.title}
          subtitle={product.subtitle}
          productId={product.productId}
          productName={product.productName}
          rezdyUrl={product.rezdyUrl}
          eventMeta={{
            venue,
            pickup: product.pickup,
          }}
        />
      </section>
    </main>
  );
}
