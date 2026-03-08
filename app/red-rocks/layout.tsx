import Link from "next/link";
import type { ReactNode } from "react";

const RED_ROCKS_NAV = [
  { href: "/red-rocks/concerts", label: "Concerts" },
  { href: "/red-rocks/hiking-trails", label: "Hiking" },
  { href: "/red-rocks/geology", label: "Geology" },
  { href: "/red-rocks/wildlife", label: "Wildlife" },
  { href: "/red-rocks/visiting-guide", label: "Visiting Guide" },
  { href: "/red-rocks/transportation", label: "Transportation" },
  { href: "/red-rocks/parking", label: "Parking" },
  { href: "/red-rocks/map", label: "Map" },
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
            </nav>
          </div>
          <div className="comic-panel" style={{ marginTop: 8, padding: 10, display: "flex", justifyContent: "flex-end" }}>
            <Link href="/find" className="comic-btn comic-btn-primary">
              Find a Ride to Red Rocks
            </Link>
          </div>
        </section>
      </div>
      {children}
    </>
  );
}
