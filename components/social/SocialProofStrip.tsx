import Image from "next/image";
import Link from "next/link";
import ShareActions from "@/components/shared/ShareActions";
import { getFeaturedUGCPosts } from "@/data/social/ugc-posts";

type SocialProofStripProps = {
  brandKey?: "partyatredrocks";
  title?: string;
  body?: string;
  mode?: "compact" | "feature";
  pageTitle?: string;
  pageUrl?: string;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function buildSupportMessage(pageTitle: string, pageUrl: string) {
  return `Hey - asking about this:\n${pageTitle}\n${pageUrl}`;
}

export default function SocialProofStrip({
  brandKey = "partyatredrocks",
  title = "Real ride nights",
  body = "See what rides actually look like before the show, during the drop, and after the encore plan is already handled.",
  mode = "compact",
  pageTitle = "Party At Red Rocks",
  pageUrl = "https://www.partyatredrocks.com/social",
  className,
}: SocialProofStripProps) {
  const posts = getFeaturedUGCPosts(brandKey, mode === "feature" ? 4 : 3);

  return (
    <section
      className={cx(
        "brand-panel rounded-[30px] p-6 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="brand-kicker text-[12px] sm:text-[13px] font-black uppercase tracking-[0.22em]">Ride nights</div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/72 sm:text-[15px]">{body}</p>
        </div>
      </div>

      <div className={cx("mt-6 grid gap-4", mode === "feature" ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3")}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.postUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="brand-card group overflow-hidden rounded-[24px] transition duration-300 hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.02),rgba(5,8,22,0.72)_100%)]" />
              <div className="absolute left-4 top-4 rounded-full border border-white/14 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/86">
                {post.platform}
              </div>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--brand-cyan)]">{post.username}</div>
              <p className="mt-3 text-sm leading-6 text-white/80">{post.caption}</p>
              <div className="mt-4 text-sm font-bold text-[var(--brand-orange)]">Open post →</div>
            </div>
          </Link>
        ))}
      </div>

      {mode === "feature" ? (
        <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 sm:p-5">
          <ShareActions brandKey={brandKey} url={pageUrl} title={pageTitle} mode="feature" />
        </div>
      ) : null}
    </section>
  );
}
