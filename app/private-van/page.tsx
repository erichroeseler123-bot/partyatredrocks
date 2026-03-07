import { permanentRedirect } from "next/navigation";

export default function PrivateVanPage() {
  permanentRedirect("/find");
}
