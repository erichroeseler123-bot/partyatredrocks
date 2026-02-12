export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Expected payload from DCC / cron
 */
type PublishPacket = {
  slug: string;
  title: string;
  body: string;
};

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.PARR_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const packet = (await req.json()) as PublishPacket;
  const { slug, title, body } = packet;

  if (!slug || !title || !body) {
    return new NextResponse("Invalid packet", { status: 400 });
  }

  const newsDir = path.join(process.cwd(), "app/news", slug);
  const pagePath = path.join(newsDir, "page.tsx");

  // Idempotent: do not overwrite existing articles
  if (fs.existsSync(pagePath)) {
    return NextResponse.json({
      status: "exists",
      path: "/news/" + slug,
    });
  }

  fs.mkdirSync(newsDir, { recursive: true });

  const pageCode = [
    `export const metadata = {`,
    `  title: ${JSON.stringify(title)},`,
    `};`,
    ``,
    `export default function NewsArticle() {`,
    `  return (`,
    `    <main className="max-w-3xl mx-auto px-6 py-24">`,
    `      <h1 className="text-4xl font-black mb-8">${title}</h1>`,
    `      <article className="prose prose-invert">`,
    `        ${body}`,
    `      </article>`,
    `    </main>`,
    `  );`,
    `}`,
  ].join("\n");

  fs.writeFileSync(pagePath, pageCode);

  return NextResponse.json({
    status: "published",
    path: "/news/" + slug,
  });
}
