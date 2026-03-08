import { permanentRedirect } from "next/navigation";

export default function ScenesIndexRedirect() {
  permanentRedirect("/scene");
}
