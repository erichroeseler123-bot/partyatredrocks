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
          <div className="comic-panel" style={{ padding: 10 }}>
            <nav
              aria-label="Red Rocks categories"
              className="rr-nav-scroll flex flex-wrap justify-center gap-3 sm:gap-4 px-4 max-w-full"
              style={{
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {RED_ROCKS_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="comic-btn comic-btn-secondary whitespace-nowrap text-sm sm:text-base py-2 px-4"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <style jsx>{`
              .rr-nav-scroll::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
          <div className="comic-panel" style={{ marginTop: 8, padding: 10 }}>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2 w-full">
              <Link
                href="/find"
                className="comic-btn comic-btn-primary w-full sm:w-auto min-w-[180px] text-center"
              >
                Find a Ride →
              </Link>
              <Link
                href="/red-rocks/transportation"
                className="comic-btn comic-btn-secondary w-full sm:w-auto min-w-[180px] text-center"
              >
                Transportation Guide
              </Link>
            </div>
          </div>
        </section>
      </div>
      {children}
    </>
  );
}
