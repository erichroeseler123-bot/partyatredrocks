import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { SITE_CONFIG } from "@/app/site-config";
import SocialLinks from "@/components/shared/SocialLinks";
import { BUSINESS_PHONE } from "@/lib/seo/siteTrust";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";
import { SUBURBAN_2027_USD, VAN_2027_USD } from "@/lib/pricing";

const FOOTER_GROUPS = [
  {
    title: "Book Private Ride",
    links: [
      { href: "/book/red-rocks-amphitheatre/private#suv-booking", label: `Private Suburban ($${SUBURBAN_2027_USD})` },
      { href: "/book/red-rocks-amphitheatre/private#van-upgrade", label: `Private Van ($${VAN_2027_USD})` },
      { href: "/red-rocks/concerts", label: "2027 Concert Schedule" },
      { href: "/booking", label: "Manage Existing Booking" },
    ],
  },
  {
    title: "Red Rocks Night",
    links: [
      { href: "/guide/tailgating", label: "Upper North Tailgating" },
      { href: "/red-rocks/what-to-wear", label: "What to Wear by Month" },
      { href: "/red-rocks/post-concert-exit-guide", label: "Post-Concert Exit Guide" },
      { href: "/red-rocks/weather", label: "Mountain Weather Prep" },
    ],
  },
  {
    title: "Logistics & Hubs",
    links: [
      { href: "/guide/local/denver-pickups", label: "Denver & Golden Pickups" },
      { href: "/guide/parking", label: "Parking Lot Breakdown" },
      { href: "/guide/logistics/bag-policy", label: "Single-Pocket Bag Rules" },
      { href: "/red-rocks", label: "Red Rocks Guide Hub" },
      { href: "/venues", label: "All Colorado Venues" },
    ],
  },
  {
    title: "Company & Support",
    links: [
      { href: "/about", label: "About & Licensing" },
      { href: "/contact", label: "Dispatch & Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Booking Terms" },
      { href: "https://gosno.co", label: "Winter: GoSno Ski ↗" },
    ],
  },
] as const;

export default function SiteFooter() {
  const brandKey = SITE_CONFIG.socialBrandKey;
  const footerMessage = PARR_PUBLIC_FACTS.support.smsLead;
  const smsUrl = `sms:${BUSINESS_PHONE.replace(/^\+/, "")}?&body=${encodeURIComponent(footerMessage)}`;
  const whatsappUrl = `https://wa.me/${BUSINESS_PHONE.replace(/^\+/, "")}?text=${encodeURIComponent(footerMessage)}`;

  return (
    <footer className="mt-16 border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,122,77,0.12),transparent_32%),linear-gradient(180deg,#0b101d_0%,#060911_100%)] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-8 md:px-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-md">
              <BrandMark className="mb-3" variant="footer" />
              <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb07c]">
                Party at Red Rocks · Morrison &amp; Denver, CO
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/78">
                Private round-trip Red Rocks concert transportation with door-to-door pickup, Upper North Lot tailgating gear (chairs, cooler, speaker &amp; ice), a dedicated driver waiting through the show, and your safe ride home.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/65">
                Party at Red Rocks and{" "}
                <a
                  href="https://gosno.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ffb07c] underline hover:text-white"
                >
                  GoSno
                </a>{" "}
                are independent Colorado transportation services connected to{" "}
                <a
                  href="https://destinationcommandcenter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ffb07c] underline hover:text-white"
                >
                  Destination Command Center&apos;s
                </a>{" "}
                Colorado travel network. The same Colorado transportation operation runs Party at Red Rocks during the summer concert season and GoSno during the winter ski season, with 24/7 scheduled service subject to live availability.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FOOTER_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-[#ffb07c]">
                    {group.title}
                  </div>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <Link
                        key={link.href + link.label}
                        className="text-sm text-white/78 no-underline transition hover:text-white"
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

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/80">{PARR_PUBLIC_FACTS.support.longWording}</p>
              <p className="mt-1 text-xs text-white/55">
                © {new Date().getFullYear()} Party at Red Rocks · Colorado PUC LL-02649 · All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={smsUrl}
                className="inline-flex min-h-10 items-center rounded-full bg-[#ff7a4d] px-4 text-xs font-black uppercase tracking-[0.12em] text-[#140804] no-underline transition hover:bg-[#ff926b]"
              >
                Text 720-369-6292
              </Link>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-10 items-center rounded-full border border-white/16 bg-white/6 px-4 text-xs font-bold uppercase tracking-[0.12em] text-white no-underline transition hover:bg-white/12"
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
