import Link from "next/link";

const FOOTER_GROUPS = [
  {
    title: "Rides",
    links: [
      { href: "/book-shuttle", label: "Book Shuttle" },
      { href: "/private-suburban", label: "Private Suburban" },
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
      { href: "/find", label: "Find Ride" },
      { href: "/book", label: "Book Flow" },
    ],
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#070A12]/78 backdrop-blur-xl">
      <div className="comic-wrap py-12">
        <div className="comic-panel !p-6 md:!p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div className="max-w-md">
              <div className="comic-kicker">
                Party at Red Rocks
              </div>
              <div className="mt-3 text-sm text-muted">
                Built for show-night execution: clear pickups, fixed pricing, and a guaranteed ride back
                after the encore.
              </div>
              <div className="mt-5 h-2 max-w-[360px] rounded-full opacity-70 bg-[repeating-linear-gradient(90deg,rgba(103,232,249,0.65)_0_8px,rgba(168,85,247,0.6)_8px_16px,rgba(255,255,255,0.2)_16px_22px)]" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {FOOTER_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="comic-tag">{group.title}</div>
                  <div className="mt-3 flex flex-col gap-2">
                    {group.links.map((link) => (
                      <Link key={link.href} className="comic-btn comic-btn-secondary !justify-start !min-h-[38px]" href={link.href}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-8 h-2 rounded-full opacity-70"
            aria-hidden="true"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(103,232,249,0.65) 0 8px, rgba(168,85,247,0.6) 8px 16px, rgba(255,255,255,0.2) 16px 22px)",
            }}
          />

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="comic-kicker">
              Control Deck Active
            </div>
            <div>© {new Date().getFullYear()} Party at Red Rocks. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
