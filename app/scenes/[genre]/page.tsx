import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ genre: string }> };

export default async function SceneGenreRedirect({ params }: Props) {
  const { genre } = await params;
  permanentRedirect(`/scene/${encodeURIComponent(genre)}`);
}
