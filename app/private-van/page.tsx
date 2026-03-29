import { redirect } from "next/navigation";

export default function PrivateVanPage() {
  redirect("/book/red-rocks-amphitheatre/private#van-upgrade");
}
