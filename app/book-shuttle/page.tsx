import { permanentRedirect } from "next/navigation";
import { appendSearchParams, type HandoffSearchParams } from "@/lib/parrHandoff";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<HandoffSearchParams>;
}) {
  const sp = await searchParams;
  permanentRedirect(appendSearchParams("/book/red-rocks-amphitheatre/private/suv", sp));
}
