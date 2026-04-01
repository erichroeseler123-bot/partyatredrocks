import { curatedImages } from "@/lib/curatedImages";
import { buildUnsplashImageSrc } from "@/lib/unsplash";

const SITE = "https://www.partyatredrocks.com";

const buildContentShareImage = (query: string, src: string, alt: string) =>
  buildUnsplashImageSrc({
    query,
    src,
    alt,
    width: 1200,
    height: 630,
  });

export const pageVisuals = {
  layout: {
    shareImage: buildContentShareImage(
      "red rocks amphitheatre concert transportation denver colorado",
      curatedImages.socialHero,
      "Red Rocks shuttle transportation",
    ),
  },
  home: {
    heroSrc: curatedImages.homepageHero,
    shuttleSrc: curatedImages.homepageShared,
    privateSrc: curatedImages.homepagePrivate,
  },
  social: {
    heroSrc: curatedImages.socialHero,
    shareFallback: curatedImages.socialHero,
  },
  scenes: {
    shareImage: buildContentShareImage(
      "colorado live music scenes concert crowd denver",
      curatedImages.scenesHero,
      "Colorado music scenes",
    ),
    heroFallbackSrc: curatedImages.socialHero,
    heroQuery: "colorado live music scenes concert crowd denver",
    buildSceneQuery: (sceneTitle: string) => `${sceneTitle} live music`,
    buildSceneFallback: (sceneTitle: string, sceneSlug: string) =>
      buildUnsplashImageSrc({
        query: `${sceneTitle} live music scene denver colorado`,
        src: `${sceneSlug} scene`,
        alt: `${sceneTitle} scene image`,
      }),
  },
  guideLocal: {
    denverPickupsShareImage: `${SITE}${buildContentShareImage(
      "downtown denver shuttle pickup red rocks",
      curatedImages.socialHero,
      "Downtown Denver Red Rocks shuttle pickup",
    )}`,
    trailheadTaphouseShareImage: `${SITE}${buildContentShareImage(
      "golden colorado shuttle pickup red rocks",
      curatedImages.socialHero,
      "Golden Red Rocks shuttle pickup",
    )}`,
  },
} as const;
