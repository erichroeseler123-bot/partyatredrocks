import Link from "next/link";

const FOOTER_GROUPS = [
  {
    title: "Rides",
    links: [
      { href: "/book-shuttle", label: "Book Shuttle" },
      { href: "/private-suburban", label: "Private SUV" },
      { href: "/private-van", label: "Private Van" },
      { href: "/party-bus", label: "Party Bus" },
    ],
  },
  {
    title: "Venues",
    links: [
      { href: "/venues", label: "All Venues" },
      { href: "/venues/red-rocks-amphitheatre", label: "Red Rocks" },
      { href: "/venues/mission-ballroom", label: "Mission Ballroom" },
      { href: "/venues/fillmore-auditorium", label: "Fillmore" },
    ],
  },
  {
    title: "Bands",
    links: [
      { href: "/bands", label: "Artist Index" },
      { href: "/search", label: "Season Search" },
      { href: "/week/red-rocks", label: "Red Rocks Week" },
      { href: "/calendar", label: "Calendar" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/guide", label: "Guide Hub" },
      { href: "/guide/red-rocks-faq", label: "Red Rocks FAQ" },
      { href: "/about", label: "About" },
      { href: "/book", label: "Book Shuttle" },
    ],
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#070A12]">
      <div className="comic-wrap py-12">
        <div className="px-1 md:px-0">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white">
                Party at Red Rocks
              </div>
              <div className="mt-3 text-sm text-white/62">
                Shared shuttles and private rides for Red Rocks show nights, with clear pickup details and a ride back after the show.
              </div>
              <div className="mt-5 h-px max-w-[360px] bg-white/12" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {FOOTER_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/48">
                    {group.title}
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        className="text-sm text-white/70 no-underline transition hover:text-white"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-8 h-px opacity-70"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04), rgba(255,255,255,0.12))",
            }}
          />

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/42">
              Party at Red Rocks
            </div>
            <div>© {new Date().getFullYear()} Party at Red Rocks. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
