import Link from "next/link";
import Script from "next/script";

const MISHAWAKA_WIDGET_URL =
  "https://gosnotransportation58.rezdy.com/catalog/643626/mishawaka?iframe=true";

export const metadata = {
  title: "Mishawaka Shuttle | Party at Red Rocks",
  description:
    "Book Mishawaka Amphitheatre shuttle transportation online with the live Mishawaka Rezdy catalog.",
};

export default function MishawakaPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1240px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,32,0.98),rgba(6,9,18,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,176,124,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(143,208,255,0.14),transparent_28%)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
              Mountain Venue Shuttle
            </div>
            <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
              Mishawaka Amphitheatre
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
              Book Mishawaka shuttle transportation online here. This page uses the live Mishawaka booking catalog.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68 sm:text-[15px]">
              Mountain timing can be tighter than a city venue, so it helps to lock in the ride before show night.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={MISHAWAKA_WIDGET_URL.replace("?iframe=true", "")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
              >
                Open Mishawaka Booking
              </a>
              <Link
                href="/venues"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
              >
                View All Venues
              </Link>
            </div>
          </div>
        </section>

        <section className="overflow-visible rounded-[30px] border border-white/10 bg-[#0b1224] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:p-6">
          <Script src="https://gosnotransportation58.rezdy.com/pluginJs" strategy="afterInteractive" />
          <div className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Book Online
          </div>
          <iframe
            seamless
            width="100%"
            height="1000"
            frameBorder="0"
            className="rezdy w-full rounded-[20px] border-0 bg-white"
            src={MISHAWAKA_WIDGET_URL}
            title="Mishawaka booking widget"
          />
        </section>
      </section>
    </main>
  );
}
