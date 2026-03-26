import Link from "next/link";
import { SITE_CONFIG } from "@/app/site-config";
import SocialLinks from "@/components/shared/SocialLinks";
import { BUSINESS_PHONE } from "@/lib/seo/siteTrust";

const FOOTER_GROUPS = [
  {
    title: "Ride Options",
    links: [
      { href: "/book/red-rocks-amphitheatre", label: "Book a Ride" },
      { href: "/private-suburban", label: "Private SUV" },
      { href: "/private-van", label: "10 Passenger Van" },
      { href: "/party-bus", label: "24 Passenger Party Bus" },
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
    title: "Artists",
    links: [
      { href: "/bands", label: "Artists" },
      { href: "/week/red-rocks", label: "Shows This Week" },
      { href: "/calendar", label: "Calendar" },
      { href: "/scenes", label: "Scenes" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/guide", label: "Guides" },
      { href: "/red-rocks/faq", label: "Red Rocks FAQ" },
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" },
      { href: "/book/red-rocks-amphitheatre", label: "Pickup Details" },
    ],
  },
] as const;

export default function SiteFooter() {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const footerMessage = "Hey - asking about Party At Red Rocks rides.";
  const smsUrl = `sms:${BUSINESS_PHONE.replace(/^\+/, "")}?&body=${encodeURIComponent(footerMessage)}`;
  const whatsappUrl = `https://wa.me/${BUSINESS_PHONE.replace(/^\+/, "")}?text=${encodeURIComponent(footerMessage)}`;

  return (
    <footer className="mt-16 border-t border-[var(--brand-border)] bg-[radial-gradient(circle_at_top,rgba(230,57,70,0.12),transparent_24%),linear-gradient(180deg,rgba(31,18,22,0.98),rgba(17,17,18,1))] text-[var(--brand-text)]">
      <div className="comic-wrap py-12">
        <div className="brand-glass-bar rounded-[28px] px-6 py-8 md:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-text)]">
                Party at Red Rocks
              </div>
              <div className="mt-3 text-[15px] text-[color:var(--brand-text-soft)]">
                Shared shuttle seats and private rides for Red Rocks concerts, with pickup points in Denver and return rides after the show.
              </div>
              <div className="mt-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-cyan)]">
                Follow real rides, show nights, and last-minute availability
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {FOOTER_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-[12px] font-black uppercase tracking-[0.16em] text-[var(--brand-text)]">
                    {group.title}
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        className="text-[15px] text-[color:var(--brand-text-soft)] no-underline transition hover:text-[var(--brand-text)]"
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
                "linear-gradient(90deg, rgba(255,183,3,0.22), rgba(255,183,3,0.06), rgba(230,57,70,0.22))",
            }}
          />

          <div className="mt-6 flex flex-col gap-2 border-t border-[color:var(--brand-border)] pt-4 text-[13px] text-[color:var(--brand-text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] font-black uppercase tracking-[0.16em] text-[var(--brand-text)]">
              Party at Red Rocks
            </div>
            <div>© {new Date().getFullYear()} Party at Red Rocks. All rights reserved.</div>
          </div>

          <div className="mt-4 border-t border-[color:var(--brand-border)] pt-4">
            <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <Link
                href={smsUrl}
                className="brand-button-primary inline-flex shrink-0 items-center px-4 py-2.5 text-sm font-semibold"
              >
                Text us
              </Link>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="brand-button-primary inline-flex shrink-0 items-center px-4 py-2.5 text-sm font-semibold"
              >
                WhatsApp
              </Link>
              <SocialLinks
                brandKey={brandKey}
                mode="footer"
                showLabels
                className="!flex-nowrap shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
