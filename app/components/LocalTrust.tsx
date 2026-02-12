import Link from 'next/link';

export default function LocalTrust() {
  return (
    <div className="bg-surface border border-white/10 p-8 rounded-3xl mt-12 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div>
        <h3 className="text-white font-black uppercase text-xl mb-2">Verified Tier-1 Operator</h3>
        <p className="text-zinc-500 text-sm max-w-sm">
          Party at Red Rocks  is a vetted Colorado carrier. From the Sheraton Downtown to the Trailhead Taphouse, we are your local Red Rocks connection.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        {/* Replace the href with your actual Google Review 'Write a review' link */}
        <Link 
          href="https://search.google.com/local/writereview?placeid=[YOUR_PLACE_ID]" 
          target="_blank"
          className="btn-primary text-sm uppercase hover:bg-red-500 transition shadow-lg"
        >
          Review us on Google
        </Link>
        <span className="text-yellow-500 font-bold tracking-widest text-sm">★★★★★ 5.0 RATING</span>
      </div>
    </div>
  );
}
