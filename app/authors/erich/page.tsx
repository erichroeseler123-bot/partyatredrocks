import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Erich | Party at Red Rocks",
  description: "Erich has worked in independent tours and transportation for 30 years. That background informs his approach to planning group transportation and explaining the practical tradeoffs of a concert trip. He now lives in Denver.",
  alternates: { canonical: "https://www.partyatredrocks.com/authors/erich" },
};

const profile = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://www.partyatredrocks.com/authors/erich#profile",
  "url": "https://www.partyatredrocks.com/authors/erich",
  "name": "Erich | Party at Red Rocks",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://www.partyatredrocks.com/authors/erich#person",
    "name": "Erich",
    "url": "https://www.partyatredrocks.com/authors/erich",
    "description": "Erich has worked in independent tours and transportation for 30 years. That background informs his approach to planning group transportation and explaining the practical tradeoffs of a concert trip. He now lives in Denver."
  }
};

export default function AuthorPage() {
  return (
    <main style={{ maxWidth: 850, margin: "0 auto", padding: "48px 24px", background: "#faf7ef", color: "#241e18", lineHeight: 1.75 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile).replace(/</g, "\\u003c") }} />
      <p style={{ color: "#563078", fontWeight: 700 }}>AUTHOR · Party at Red Rocks</p>
      <h1 style={{ color: "#241e18", fontSize: "2rem", lineHeight: 1.2, marginBottom: 24 }}>Erich</h1>
      <p>Erich has worked in independent tours and transportation for 30 years. That background informs his approach to planning group transportation and explaining the practical tradeoffs of a concert trip. He now lives in Denver.</p>
      <p>Erich has lived in Juneau, Skagway, Ketchikan, New Orleans, Los Angeles, Wellington in New Zealand, Charleston, and Denver.</p>
      <h2 style={{ color: "#241e18", fontSize: "1.4rem", marginTop: 32 }}>What a byline means</h2>
      <p>A byline identifies who is responsible for an article. This profile does not assign personal authorship to every guide on the site. Company-maintained information is credited to Party at Red Rocks.</p>
      <p style={{ marginTop: 24 }}><Link href="/editorial-policy" style={{ color: "#563078", textDecoration: "underline" }}>Read our editorial policy</Link> · <Link href="/about" style={{ color: "#563078", textDecoration: "underline" }}>About Party at Red Rocks</Link></p>
    </main>
  );
}
