import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { SITE_CONFIG } from "@/app/site-config";
import SocialLinks from "@/components/shared/SocialLinks";
import { buildDccRedRocksBookingHref } from "@/lib/parrHandoff";
import { BUSINESS_PHONE } from "@/lib/seo/siteTrust";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

const redRocksBookingHref = buildDccRedRocksBookingHref();

const FOOTER_GROUPS = [
  {
    title: "Book",
    links: [
      { href: "/book/red-rocks-amphitheatre/custom/shared", label: "Shuttle Tickets" },
      { href: "/book/red-rocks-amphitheatre/private#suv-booking", label: "Private SUV" },
      { href: "/book/red-rocks-amphitheatre/private#van-upgrade", label: "Van Upgrade" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/red-rocks/transportation/shuttle-vs-uber", label: "Shuttle vs Uber" },
      { href: "/red-rocks/transportation/shuttle-vs-driving", label: "Shuttle vs Driving" },
      { href: "/red-rocks/transportation/private-vs-shared", label: "Private vs Shared" },
      { href: "/red-rocks/transportation/is-shuttle-worth-it", label: "Is Shuttle Worth It?" },
    ],
  },
  {
    title: "Logistics",
    links: [
      { href: "/guide/local/denver-pickups", label: "Downtown Pickups" },
      { href: "/guide/parking", label: "Parking Guide" },
      { href: "/guide/show-night-strategy", label: "Show-Night Strategy" },
      { href: "/guide/logistics/bag-policy", label: "Bag Policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: redRocksBookingHref, label: "Booking Hub" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

export default function SiteFooter() {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const footerMessage = PARR_PUBLIC_FACTS.support.smsLead;
  const smsUrl = `sms:${BUSINESS_PHONE.replace(/^\+/, "")}?&body=${encodeURIComponent(footerMessage)}`;
  const whatsappUrl = `https://wa.me/${BUSINESS_PHONE.replace(/^\+/, "")}?text=${encodeURIComponent(footerMessage)}`;

  return (
    <footer className="mt-16 border-t border-[var(--brand-border)] bg-[radial-gradient(circle_at_top,rgba(230,57,70,0.12),transparent_24%),linear-gradient(180deg,rgba(31,18,22,0.98),rgba(17,17,18,1))] text-[var(--brand-text)]">
      <div className="comic-wrap py-12">
        <div className="brand-glass-bar rounded-[28px] px-6 py-8 md:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <BrandMark
                className="mb-3"
                frameClassName="h-10 w-[156px] sm:h-11 sm:w-[172px]"
                imageClassName="h-20 sm:h-[88px]"
              />
              <div className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--brand-text)]">
                Party at Red Rocks
              </div>
              <div className="mt-3 text-[15px] text-[color:var(--brand-text-soft)]">
                Shared shuttle tickets, private SUVs, and direct pickup planning for Red Rocks show nights.
              </div>
              <div className="mt-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-cyan)]">
                Compare the ride, pick the plan, and book it
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
            <BrandMark
              frameClassName="h-8 w-[132px]"
              imageClassName="h-16"
            />
            <div>© {new Date().getFullYear()} Party at Red Rocks. All rights reserved.</div>
          </div>

          <div className="mt-4 border-t border-[color:var(--brand-border)] pt-4">
            <p className="mb-3 max-w-2xl text-sm text-[color:var(--brand-text-soft)]">
              {PARR_PUBLIC_FACTS.support.longWording}
            </p>
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
