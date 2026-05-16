import type { Metadata } from "next";
import Link from "next/link";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildSharedBookingMetadata } from "../../shared/sharedBookingSeo";

export const runtime = "nodejs";
export const revalidate = 300;

const SHARED_PICKUP_OPTIONS = [
  {
    href: "/book/red-rocks-amphitheatre/custom/shared/denver",
    eyebrow: "Denver shuttle",
    title: "Denver to Red Rocks Shuttle",
    body: "Use this if you want the Denver shared shuttle pickup and return after the show.",
  },
  {
    href: "/book/red-rocks-amphitheatre/custom/shared/golden",
    eyebrow: "Golden / Westside shuttle",
    title: "Westside Shuttle to Red Rocks",
    body: "Use this if you want the Golden westside shared shuttle pickup and return after the show.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>;
}): Promise<Metadata> {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") return {};
  return buildSharedBookingMetadata(`/book/${venue}/custom/shared`);
}

export default async function SharedCustomOptionsPage({
  params,
}: {
  params: Promise<{ venue: string }>;
  searchParams: Promise<HandoffSearchParams>;
}) {
  const { venue } = await params;
  if (venue !== "red-rocks-amphitheatre") return null;

  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1040px] flex-col gap-6">
        <section className="rounded-[34px] border border-white/10 bg-[#0b1224] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10">
          <div className="inline-flex items-center rounded-full border border-[#8fd0ff]/24 bg-[#8fd0ff]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
            Shared Shuttle
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] text-white sm:text-[4rem]">
            Choose your Red Rocks shuttle pickup
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/80 sm:text-lg">
            Denver and Golden shared shuttle booking now opens through the temporary Rezdy widgets. Native Party at Red Rocks checkout remains preserved for rollback.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {SHARED_PICKUP_OPTIONS.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="rounded-[30px] border border-white/10 bg-[#0b1224] p-6 text-white no-underline transition hover:-translate-y-1 hover:border-[#62f6ff]/45"
            >
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
                {option.eyebrow}
              </div>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em]">{option.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/72">{option.body}</p>
              <div className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[#62f6ff] bg-[#62f6ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#05111a]">
                Open booking widget
              </div>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
