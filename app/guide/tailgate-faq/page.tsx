import Link from "next/link";
import FAQBlock from "@/components/FAQBlock";
import type { HandoffSearchParams } from "@/lib/parrHandoff";
import { buildBookingHref } from "@/lib/parrHandoff";

export const metadata = {
  title: "Red Rocks Tailgate FAQ",
  description:
    "Common questions about tailgating at Red Rocks, parking-lot expectations, private rides, and Upper North limo-lane access.",
  alternates: {
    canonical: "/guide/tailgate-faq",
  },
};

const rows = [
  {
    id: "tailgate-allowed",
    question: "Can you tailgate at Red Rocks?",
    answer:
      "Yes. Many groups tailgate before the show, but the experience depends on arrival timing, lot location, weather, and how much gear you bring.",
  },
  {
    id: "best-lot",
    question: "What lot is best for tailgating?",
    answer:
      "It depends on whether your group cares more about parking convenience, walking distance, or post-show exit. There is not one perfect lot for every show.",
  },
  {
    id: "arrival-time",
    question: "What time should you arrive for tailgating?",
    answer:
      "Earlier is usually better. Tailgating works best when you leave enough time to park, settle in, and still get through the gates without rushing.",
  },
  {
    id: "private-vs-shuttle",
    question: "Is a private ride better than a shuttle for tailgating?",
    answer:
      "For groups who want to tailgate, private service is usually the better fit. Your group stays together, arrives together, and heads home together after the show.",
  },
  {
    id: "limo-lane",
    question: "Do private rides use the limo lane?",
    answer:
      "Yes. Private rides use the Upper North limo lane, which gives groups a smoother arrival plan than general parking.",
  },
  {
    id: "upper-north",
    question: "Why does Upper North access matter?",
    answer:
      "Upper North limo-lane access can make arrival easier for private groups and is a strong fit when tailgating is part of the plan.",
  },
  {
    id: "after-show",
    question: "What happens after the concert ends?",
    answer:
      "With private service, your return ride is already planned. Pickup details are sent before the ride, and your group heads back together after the show.",
  },
];

export default async function TailgateFaqPage({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <main className="bg-[#050816] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,11,18,0.96),rgba(10,9,20,0.96))] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)] sm:p-10 lg:p-12">
          <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ffb07c]">
            Tailgate FAQ
          </div>
          <h1 className="mt-5 text-[2.5rem] font-black uppercase leading-[0.94] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
            Red Rocks Tailgate FAQ
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/74 sm:text-lg">
            Quick answers about tailgating, parking-lot expectations, private rides, and Upper North limo-lane access.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/guide/tailgating"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
            >
              Tailgating Guide
            </Link>
            <Link
              href={buildBookingHref({ target: "private", venue: "red-rocks-amphitheatre", searchParams: sp })}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#3df3ff] px-6 text-sm font-black uppercase tracking-[0.16em] text-[#07111d] transition hover:bg-[#62f6ff]"
            >
              Book a Private Ride
            </Link>
          </div>
        </section>

        <FAQBlock title="Tailgating FAQ" rows={rows} />
      </section>
    </main>
  );
}
