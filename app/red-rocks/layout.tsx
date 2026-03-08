import Link from "next/link";
import type { ReactNode } from "react";

const RED_ROCKS_NAV = [
  { href: "/red-rocks", label: "Red Rocks Guide" },
  { href: "/red-rocks/concerts", label: "Concerts" },
  { href: "/red-rocks/hiking-trails", label: "Hiking" },
  { href: "/red-rocks/geology", label: "Geology" },
  { href: "/red-rocks/wildlife", label: "Wildlife" },
  { href: "/red-rocks/visiting-guide", label: "Visiting Guide" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/map", label: "Map" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/faq", label: "FAQ" },
] as const;

export default function RedRocksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="comic-page pt-20">
        <section className="comic-wrap">
          <div className="comic-panel" style={{ padding: 10, overflowX: "auto" }}>
            <nav
              aria-label="Red Rocks cluster navigation"
              style={{
                display: "flex",
                gap: 8,
                minWidth: "max-content",
                whiteSpace: "nowrap",
              }}
            >
              {RED_ROCKS_NAV.map((item) => (
                <Link key={item.href} href={item.href} className="comic-btn comic-btn-secondary">
                  {item.label}
                </Link>
              ))}
              <Link href="/find" className="comic-btn comic-btn-primary">
                Book Shuttle
              </Link>
            </nav>
          </div>
          <div className="comic-panel" style={{ marginTop: 8, padding: 10, overflowX: "auto" }}>
            <nav
              aria-label="Red Rocks flywheel links"
              style={{
                display: "flex",
                gap: 8,
                minWidth: "max-content",
                whiteSpace: "nowrap",
              }}
            >
              <Link href="/red-rocks" className="comic-btn comic-btn-secondary">
                /red-rocks
              </Link>
              <Link href="/red-rocks/transportation" className="comic-btn comic-btn-secondary">
                /red-rocks/transportation
              </Link>
              <Link href="/red-rocks/parking" className="comic-btn comic-btn-secondary">
                /red-rocks/parking
              </Link>
              <Link href="/red-rocks/faq" className="comic-btn comic-btn-secondary">
                /red-rocks/faq
              </Link>
              <Link href="/find" className="comic-btn comic-btn-primary">
                /find
              </Link>
            </nav>
          </div>
        </section>
      </div>
      {children}
    </>
  );
}
