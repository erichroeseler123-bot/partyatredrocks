import Link from "next/link";
import type { OpsView } from "@/lib/parr/ops/types";

export default function OpsViewTabs({
  activeView,
  buildHref,
}: {
  activeView: OpsView;
  buildHref: (view: OpsView) => string;
}) {
  const tabs: Array<{ key: OpsView; label: string }> = [
    { key: "calendar", label: "Calendar" },
    { key: "run-sheet", label: "Run Sheet" },
    { key: "all-orders", label: "All Orders" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={buildHref(tab.key)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            activeView === tab.key
              ? "border-orange-300 bg-orange-400/20 text-orange-100"
              : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
