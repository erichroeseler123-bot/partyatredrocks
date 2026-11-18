import { permanentRedirect } from "next/navigation";

export default function PrivateSuburbanPage() {
  permanentRedirect("/book/red-rocks-amphitheatre/private#suv-booking");
}
