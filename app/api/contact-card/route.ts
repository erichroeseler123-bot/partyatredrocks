import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const website = searchParams.get('website') || 'https://www.partyatredrocks.com';
  const phone = searchParams.get('phone') || '720-369-6292';
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Red Rocks Shuttle Info (Party at Red Rocks)',
    'ORG:Party at Red Rocks',
    `TEL;TYPE=CELL:${phone}`,
    `URL:${website}`,
    'NOTE:Premium shared and private Red Rocks shuttles. Text for show-day help!',
    'END:VCARD',
    '',
  ].join('\r\n');

  return new NextResponse(vcard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="red-rocks-shuttle-info.vcf"',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
