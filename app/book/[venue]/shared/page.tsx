import { BookingVisualHero } from "@/components/booking/BookingVisualHero";
import Script from "next/script";
import { notFound } from "next/navigation";
import venuesJson from "@/data/venues.json";
import { RecentBookingToast } from "@/components/RecentBookingToast";
import { bookingVisuals } from "@/lib/bookingVisuals";

export const runtime = "nodejs";
export const revalidate = 300;

type VenueRow = {
  slug?: string;
  name?: string;
};

const SHARED_CATALOG_WIDGET_URL = "https://gosnotransportation58.rezdy.com/catalog/617787/shuttles?iframe=true";

function getVenue(slug: string): VenueRow | null {
  return (venuesJson as Record<string, VenueRow>)[slug] ?? null;
}

export default async function SharedOptionsPage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") notFound();
  const row = getVenue(venue);
  if (!row?.name) notFound();

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <RecentBookingToast />
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <BookingVisualHero
          eyebrow={bookingVisuals.shared.eyebrow}
          title={bookingVisuals.shared.title}
          copy={bookingVisuals.shared.copy}
          imageSrc={bookingVisuals.shared.imageSrc}
          imageAlt={bookingVisuals.shared.imageAlt}
        />

        <section className="overflow-visible rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <Script src="https://gosnotransportation58.rezdy.com/pluginJs" strategy="afterInteractive" />
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Per-Person Shuttle
          </div>
          <p className="mb-4 max-w-3xl text-sm leading-6 text-white/70">
            This is the live per-person Red Rocks shuttle catalog. Choose the Denver or Golden departure inside the widget if you
            want to book directly from this page.
          </p>
          <iframe
            seamless
            width="100%"
            height="1000"
            frameBorder="0"
            className="rezdy w-full rounded-[20px] border-0 bg-white"
            src={SHARED_CATALOG_WIDGET_URL}
            title="Red Rocks shared shuttle catalog"
          />
        </section>
      </section>
    </main>
  );
}
