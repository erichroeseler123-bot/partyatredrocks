import { permanentRedirect } from "next/navigation";

export default function PrivateVanPage() {
  permanentRedirect("/book/red-rocks-amphitheatre/private#van-upgrade");
}
