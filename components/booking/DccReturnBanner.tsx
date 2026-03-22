import Link from "next/link";
import { buildTrackedDccReturnHref } from "@/lib/dccSatellite";
import type { HandoffSearchParams } from "@/lib/parrHandoff";

export function DccReturnBanner({
  searchParams,
  className = "",
}: {
  searchParams?: HandoffSearchParams;
  className?: string;
}) {
  const href = buildTrackedDccReturnHref(searchParams);
  if (!href) return null;

  return (
    <div
      className={`rounded-[24px] border border-[#8fd0ff]/24 bg-[rgba(61,243,255,0.08)] px-5 py-4 text-sm text-white/84 ${className}`.trim()}
    >
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8fd0ff]">
        Return Path Active
      </div>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl leading-6">
          When you are done here, you can jump back into the exact Destination Command Center context that started this handoff.
        </p>
        <Link
          href={href}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/12"
        >
          Return to DCC
        </Link>
      </div>
    </div>
  );
}
