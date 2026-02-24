template = """
import Link from "next/link";

export const metadata = {{
  title: "{title} | Party at Red Rocks",
  description: "{desc}",
}};

export default function HubPage() {{
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 bg-surface text-white">
      <h1 className="text-4xl md:text-5xl font-black mb-6">{title}</h1>
      <p className="text-xl text-soft mb-12">{desc}</p>

      {/* Sub-pages grid will go here - add links to leaf pages later */}

      <div className="mt-12 text-center">
        <Link href="/book-shuttle" className="btn-primary">
          Book Your Ride →
        </Link>
      </div>
    </div>
  );
}}
"""
