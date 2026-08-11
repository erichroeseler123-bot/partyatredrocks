import Link from "next/link";
import { GuideLocalInfo } from "@/components/guide/GuideLocalInfo";
import { GuideVisualHero } from "@/components/guide/GuideVisualHero";
import { guideVisuals } from "@/lib/guideVisuals";

export const metadata = {
  title: "Red Rocks Transportation Guide",
  description: "Private transportation vs rideshare, parking tradeoffs, and how to plan the ride home after a Red Rocks show.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-surface text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <GuideVisualHero
          eyebrow={guideVisuals.transportation.eyebrow}
          title="Red Rocks Transportation Guide"
          copy="Compare a pre-arranged private ride, rideshare, and driving so your group has one clear plan before and after the show."
          imageSrc={guideVisuals.transportation.imageSrc}
          imageAlt={guideVisuals.transportation.imageAlt}
          actions={
            <>
              <Link href="/book/red-rocks-amphitheatre/private" className="btn-primary">
                Book Private Ride — $399 / $599 →
              </Link>
              <Link href="/guide" className="btn-ghost">
                Back to Guides →
              </Link>
            </>
          }
        />

        <div className="mt-10">
          <GuideLocalInfo variant="transportation" />
        </div>

        <div className="mt-10 rounded-3xl border border-soft bg-surface-strong p-6">
          <h2 className="text-2xl font-black">What actually matters</h2>
          <ul className="mt-4 space-y-2 text-soft leading-relaxed list-disc pl-5">
            <li>Plan the return before the show so your group is not making transportation decisions in the post-show crowd.</li>
            <li>Rideshare availability and pricing can change with demand, especially when many guests leave at once.</li>
            <li>A pre-arranged private ride gives your group one vehicle, one pickup plan, and one return plan.</li>
            <li>If you drive, plan your parking and exit strategy before doors open.</li>
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-black">Quick FAQ</h2>
          <div className="mt-4 space-y-3">
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">Can I use Uber or Lyft after the show?</summary>
              <p className="mt-2 text-soft leading-relaxed">Yes, but pickup timing, driver availability, and pricing can vary with post-show demand and traffic conditions.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What does Party at Red Rocks currently offer?</summary>
              <p className="mt-2 text-soft leading-relaxed">Private Red Rocks transportation: a $399 Suburban or $599 van, with door-to-door pickup and the vehicle waiting through the show.</p>
            </details>
            <details className="rounded-2xl border border-soft bg-surface-strong p-5">
              <summary className="cursor-pointer font-black">What should my group decide before the show?</summary>
              <p className="mt-2 text-soft leading-relaxed">Choose one ride plan, one regroup point, and one fallback communication plan before the venue starts emptying.</p>
            </details>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Can I use Uber or Lyft after the show?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, but pickup timing, driver availability, and pricing can vary with post-show demand and traffic conditions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What does Party at Red Rocks currently offer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Private Red Rocks transportation: a $399 Suburban or $599 van, with door-to-door pickup and the vehicle waiting through the show."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What should my group decide before the show?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Choose one ride plan, one regroup point, and one fallback communication plan before the venue starts emptying."
                  }
                }
              ]
            }),
          }}
        />

        <footer className="mt-16 pt-10 border-t border-soft text-sm text-muted">
          Use this guide to compare ride options and choose what fits your show night.
        </footer>
      </div>
    </main>
  );
}
