import { getDccClaimsByIds } from "@/lib/dccClaims";

export interface DccSourceCitationsProps {
  claimIds: readonly string[];
  title?: string;
  description?: string;
  className?: string;
}

export function DccSourceCitations({
  claimIds,
  title = "Sources & freshness",
  description = "External venue, parking, and access rules cited on this page link directly to the issuing authority, with dated research records maintained in Destination Command Center.",
  className = "mt-10",
}: DccSourceCitationsProps) {
  const claims = getDccClaimsByIds(claimIds);
  if (claims.length === 0) return null;

  return (
    <section
      aria-label={title}
      className={`${className} rounded-3xl border border-white/12 bg-[#0b1224] p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.3)] md:p-8`}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#4cc9f0]">
        Primary-Source Citations
      </div>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/75">
        {description}
      </p>

      <ul className="mt-5 space-y-4">
        {claims.map((claim) => (
          <li
            key={claim.claimId}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <p className="text-sm leading-relaxed text-white/92">
              {claim.claimText}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/78">
              <span className="font-semibold text-white">Source:</span>{" "}
              <a
                href={claim.authorityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#8fd0ff] underline underline-offset-2 hover:text-white"
              >
                {claim.authorityName}
              </a>{" "}
              <span aria-hidden="true">·</span>{" "}
              {claim.isCurrentVerified ? (
                <span>Checked {claim.checkedAt}</span>
              ) : (
                <span className="text-amber-300">
                  Last checked {claim.checkedAt} (refresh scheduled)
                </span>
              )}{" "}
              <span aria-hidden="true">·</span>{" "}
              <a
                href={claim.dccRecordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/65 underline underline-offset-2 hover:text-white"
              >
                DCC record
              </a>
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/60">
              Scope note: {claim.limitationsNote}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
