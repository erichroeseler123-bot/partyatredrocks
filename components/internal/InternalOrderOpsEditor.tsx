"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type FollowUpStatus = "new" | "contacted" | "waiting" | "resolved";

export default function InternalOrderOpsEditor({
  internalOrderId,
  initialNotes,
  initialFollowUpStatus,
  canMarkPaymentRequestSent,
  paymentRequestSentAt,
  operatorPaymentStep,
}: {
  internalOrderId: string;
  initialNotes: string;
  initialFollowUpStatus: FollowUpStatus;
  canMarkPaymentRequestSent?: boolean;
  paymentRequestSentAt?: string | null;
  operatorPaymentStep?: "none" | "request_sent" | "paid" | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(initialNotes);
  const [followUpStatus, setFollowUpStatus] = useState<FollowUpStatus>(initialFollowUpStatus);
  const [statusText, setStatusText] = useState<string>("");

  const canMarkSentButton =
    !!canMarkPaymentRequestSent &&
    operatorPaymentStep !== "request_sent" &&
    operatorPaymentStep !== "paid";

  async function save(markPaymentRequestSent = false) {
    setStatusText("");
    try {
      const response = await fetch(`/api/internal/orders/${encodeURIComponent(internalOrderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, followUpStatus, markPaymentRequestSent }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Save failed");
      }
      setStatusText("Saved");
      startTransition(() => router.refresh());
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Save failed");
    }
  }

  return (
    <div className="flex min-w-[280px] flex-col gap-2">
      <select
        value={followUpStatus}
        onChange={(e) => setFollowUpStatus(e.target.value as FollowUpStatus)}
        className="rounded-lg border border-white/20 bg-black/30 px-2 py-1 text-xs text-white"
      >
        <option value="new">new</option>
        <option value="contacted">contacted</option>
        <option value="waiting">waiting</option>
        <option value="resolved">resolved</option>
      </select>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="ops note"
        className="rounded-lg border border-white/20 bg-black/30 px-2 py-1 text-xs text-white"
      />
      <button
        type="button"
        onClick={() => save(false)}
        disabled={isPending}
        className="comic-btn comic-btn-secondary !min-h-8 !px-3 !text-[10px]"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
      {canMarkSentButton ? (
        <button
          type="button"
          onClick={() => save(true)}
          disabled={isPending}
          className="comic-btn comic-btn-primary !min-h-8 !px-3 !text-[10px]"
        >
          {isPending ? "Sending..." : "Mark Payment Request Sent"}
        </button>
      ) : null}
      {operatorPaymentStep === "request_sent" && paymentRequestSentAt ? (
        <span className="text-[10px] text-amber-200">
          payment request sent: {new Date(paymentRequestSentAt).toLocaleString("en-US")}
        </span>
      ) : null}
      {operatorPaymentStep === "paid" ? (
        <span className="text-[10px] text-emerald-200">payment completed (webhook)</span>
      ) : null}
      {statusText ? <span className="text-[10px] text-white/70">{statusText}</span> : null}
    </div>
  );
}
