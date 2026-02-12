import Link from 'next/link';

interface GbpPostProps {
  title: string;
  date: string;
  content: string;
  ctaLink: string;
}

export default function GbpPost({ title, date, content, ctaLink }: GbpPostProps) {
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition mb-6">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{date}</span>
      <h3 className="text-xl font-bold mt-1 mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 mb-4 line-clamp-3">{content}</p>
      <Link href={ctaLink} className="text-red-700 font-bold hover:underline">
        Read Full Update →
      </Link>
    </div>
  );
}
