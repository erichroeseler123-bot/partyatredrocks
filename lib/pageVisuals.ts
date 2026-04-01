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
  compare: {
    title: "Comparing Red Rocks Ride Options",
    description:
      "Compare fixed-price shared shuttle seats, private SUV service, and Sprinter van options for Red Rocks so your group can pick the right ride plan before show night.",
    shareImage: `${SITE}${buildContentShareImage(
      "red rocks amphitheatre parking sunset",
      curatedImages.compareHero,
      "Comparing Red Rocks ride options",
    )}`,
  },
  logistics: {
    title: "Show-Night Planning Guide",
    description:
      "Arrival windows, weather risk, pickup timing, and the return plan that keep a Red Rocks night moving cleanly from meetup to ride home.",
    shareImage: `${SITE}${buildContentShareImage(
      "red rocks amphitheatre walking up stairs concert night",
      curatedImages.logisticsHero,
      "Show-night planning at Red Rocks",
    )}`,
  },
  social: {
    title: "Party At Red Rocks Social | Real Rides, Real Nights, Real Groups",
    description:
      "See real ride nights, group arrivals, and concert transport moments from Party At Red Rocks. Follow the route, send it to your group, or ask about your ride.",
    heroSrc: curatedImages.socialHero,
    shareFallback: curatedImages.socialHero,
    shareImage: `${SITE}${buildContentShareImage(
      "red rocks shuttle group arrival concert night",
      curatedImages.weekHero,
      "Party At Red Rocks social proof gallery",
    )}`,
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
