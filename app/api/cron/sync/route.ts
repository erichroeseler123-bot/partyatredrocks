import { venues } from "@/data/venues";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    venues: Object.keys(venues),
  });
}
