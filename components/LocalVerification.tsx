import Link from 'next/link';

export default function LocalVerification() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-white font-black uppercase text-xl mb-2">Verified Local Operator</h3>
          <p className="text-zinc-500 text-sm max-w-sm">
            Party at Red Rocks is a registered Colorado business. Proudly serving the Denver, Golden, and Morrison concert communities since 2024.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          {/* Replace with your actual Google Review Link */}
          <Link 
            href="https://g.page/r/[YOUR_GBP_ID]/review" 
            target="_blank"
            className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm uppercase hover:bg-zinc-200 transition"
          >
            Review us on Google
          </Link>
          <span className="text-yellow-500 font-bold">★★★★★ 5.0 Rating</span>
        </div>
      </div>
    </div>
  );
}
