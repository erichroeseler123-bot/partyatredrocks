import Link from "next/link";
import { PARR_PUBLIC_FACTS } from "@/lib/publicOperatorFacts";

type LegalInlineNoticeProps = {
  className?: string;
};

export function LegalInlineNotice({ className = "" }: LegalInlineNoticeProps) {
  return (
    <div
      className={[
        "rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-6 text-white/68",
        className,
      ].join(" ").trim()}
    >
      <p>
        By continuing, you agree to the{" "}
        <Link href="/terms" className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
          Terms
        </Link>{" "}
        and acknowledge the{" "}
        <Link href="/privacy" className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white">
          Privacy Policy
        </Link>
        . Booking details may include rider names, contact info, payment status, and pickup coordination notes.
      </p>
      <p className="mt-2 text-white/54">
        Questions before checkout? Contact {PARR_PUBLIC_FACTS.support.phoneDisplay} or {PARR_PUBLIC_FACTS.support.email}.
      </p>
    </div>
  );
}
