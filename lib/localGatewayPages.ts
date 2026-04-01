import { curatedImages } from "@/lib/curatedImages";
import { buildUnsplashImageSrc } from "@/lib/unsplash";

const SITE = "https://www.partyatredrocks.com";

export const SHARED_BOOKING_PATH = "/book/red-rocks-amphitheatre/custom/shared";
export const PRIVATE_BOOKING_PATH = "/book/red-rocks-amphitheatre/private";

export type LocalGatewaySlug =
  | "maven-hotel-red-rocks-shuttle"
  | "union-station-red-rocks-shuttle"
  | "golden-red-rocks-shuttle"
  | "avanti-red-rocks-shuttle"
  | "morrison-red-rocks-ride-options";

type NearbySpot = {
  name: string;
  note: string;
};

type LocalGatewayPage = {
  slug: LocalGatewaySlug;
  locationName: string;
  landmarkName: string;
  pickupLabel: string;
  seoTitle?: string;
  seoDescription?: string;
  heroTitle: string;
  heroBody: string;
  whyThisWorks: string;
  bestFor: string;
  localAngle: string;
  localGuideIntro: string;
  nearbySpots: NearbySpot[];
  faqLocationAnswer: string;
  shareImage: string;
  heroImageSrc: string;
  heroImageAlt: string;
};

const buildShareImage = (query: string, src: string, alt: string) =>
  `${SITE}${buildUnsplashImageSrc({ query, src, alt, width: 1200, height: 630 })}`;

export const localGatewayPages: Record<LocalGatewaySlug, LocalGatewayPage> = {
  "maven-hotel-red-rocks-shuttle": {
    slug: "maven-hotel-red-rocks-shuttle",
    locationName: "The Maven Hotel",
    landmarkName: "The Maven Hotel / Dairy Block",
    pickupLabel: "LoDo Hotel Pickup",
    heroTitle: "The Best Way to Get from The Maven Hotel to Red Rocks",
    heroBody:
      "Skip the $100 Ubers and mountain driving. Join the party with our premium round-trip shuttle service departing directly from The Maven Hotel and Dairy Block area.",
    whyThisWorks:
      "Stay in the heart of Denver and walk a couple of minutes to your ride. This is the cleanest move for out-of-towners who want the full Dairy Block and LoDo experience before the show.",
    bestFor: "Visitors staying in LoDo who want dinner, drinks, and a short walk to pickup.",
    localAngle:
      "The Maven page should feel like the easiest hotel-based launch point for a Red Rocks night.",
    localGuideIntro:
      "If you are staying at The Maven or nearby in LoDo, this pickup keeps the night simple: pregame in Dairy Block, walk to the shuttle, and come back to downtown without dealing with mountain traffic.",
    nearbySpots: [
      { name: "Poka Lola Social Club", note: "Cocktails before the walk to pickup." },
      { name: "Kachina Cantina", note: "Easy pre-show food inside Dairy Block." },
    ],
    faqLocationAnswer:
      "The Maven-area pickup is set around Dairy Block / LoDo so riders can walk over from nearby hotels without needing a second ride.",
    shareImage: buildShareImage(
      "maven hotel denver red rocks shuttle",
      curatedImages.guideTransportation,
      "The Maven Hotel to Red Rocks shuttle planning",
    ),
    heroImageSrc: curatedImages.guideTransportation,
    heroImageAlt: "Red Rocks shuttle arrival planning from downtown Denver hotels",
  },
  "union-station-red-rocks-shuttle": {
    slug: "union-station-red-rocks-shuttle",
    locationName: "Union Station",
    landmarkName: "Union Station transit hub",
    pickupLabel: "Union Station Pickup",
    seoTitle: "Union Station to Red Rocks Shuttle | $59 Round-Trip | Party at Red Rocks 2026",
    seoDescription:
      "Catch the best Red Rocks shuttle from Denver Union Station. Fixed $59 shared seats, guaranteed return after the show, and zero surge pricing. Book your 2026 concert ride now!",
    heroTitle: "The Smart Way to Get from Union Station to Red Rocks",
    heroBody:
      "Skip the $120 Uber surges and the headache of downtown parking. Join Party at Red Rocks for a high-energy round-trip shuttle departing from Denver's transit hub.",
    whyThisWorks:
      "Union Station is not just a train stop. It is one of the cleanest launch points for a Red Rocks night. Whether you are staying at The Crawford, The Oxford, or coming in on the A-Line from DIA, this pickup keeps the whole plan simple. Grab a pre-show drink at Terminal Bar, meet your crew, and head to Red Rocks without dealing with surge pricing, rental cars, or post-show rideshare chaos.",
    bestFor: "Airport arrivals, downtown hotel guests, and riders who want the most convenient transit-to-show handoff in Denver.",
    localAngle:
      "This page should win on the transit-hub angle: fresh off the A-Line, one drink at Terminal Bar, then straight to the rocks for $59 instead of a corporate $65-plus shuttle or a triple-digit Uber.",
    localGuideIntro:
      "Union Station is the cleanest airport-to-hotel-to-show flow in Denver. Meet your group in the Great Hall, grab a quick drink at Terminal Bar or a meal at Thirsty Lion, then board a fixed-price ride with the return already handled after the encore.",
    nearbySpots: [
      { name: "Terminal Bar", note: "The easiest pre-show drink stop inside the station." },
      { name: "Thirsty Lion", note: "A fast meal before boarding the shuttle." },
      { name: "The Maven Hotel", note: "An easy stay-and-play option just a short walk away in LoDo." },
    ],
    faqLocationAnswer:
      "Union Station riders receive the final pickup instructions before departure, and the handoff is built for walkability from nearby hotels and the A-Line arrival zone.",
    shareImage: buildShareImage(
      "union station denver red rocks shuttle",
      curatedImages.guideTransportation,
      "Union Station to Red Rocks shuttle",
    ),
    heroImageSrc: curatedImages.guideTransportation,
    heroImageAlt: "Union Station riders planning transportation to Red Rocks",
  },
  "golden-red-rocks-shuttle": {
    slug: "golden-red-rocks-shuttle",
    locationName: "Golden",
    landmarkName: "Golden pickup hub",
    pickupLabel: "West Side Pickup",
    heroTitle: "The Best Way to Get from Golden to Red Rocks",
    heroBody:
      "Skip the parking stress and post-show traffic. Join a round-trip Red Rocks shuttle from Golden and keep the foothills side of the night simple.",
    whyThisWorks:
      "Golden gives you the west-side advantage. You are closer to the venue, closer to the foothills hotels, and positioned for a cleaner in-and-out than most downtown riders.",
    bestFor: "Locals and foothills visitors who want a west-side ride plan with less traffic stress.",
    localAngle:
      "The Golden page should feel like the practical local move for west-side riders.",
    localGuideIntro:
      "Golden is the best pickup fit for riders who already live or stay near the foothills. It cuts down on downtown traffic and makes the ride home easier after the encore.",
    nearbySpots: [
      { name: "Trailhead Taphouse", note: "Solid pre-show meetup spot in Golden." },
      { name: "Mountain Toad Brewing", note: "Quick beer stop before pickup." },
    ],
    faqLocationAnswer:
      "Golden pickup details are shared with your booking, and the area is designed for riders staying near the foothills who want to avoid downtown departure traffic.",
    shareImage: buildShareImage(
      "golden colorado red rocks shuttle",
      curatedImages.guidePickup,
      "Golden to Red Rocks shuttle planning",
    ),
    heroImageSrc: curatedImages.guidePickup,
    heroImageAlt: "Golden pickup and shuttle planning for Red Rocks",
  },
  "avanti-red-rocks-shuttle": {
    slug: "avanti-red-rocks-shuttle",
    locationName: "Avanti",
    landmarkName: "Avanti F&B",
    pickupLabel: "RiNo Pregame Pickup",
    heroTitle: "The Best Way to Get from Avanti to Red Rocks",
    heroBody:
      "Skip the chaotic rideshare scramble. Start with food and drinks at Avanti, then walk to a premium round-trip shuttle built for Red Rocks show nights.",
    whyThisWorks:
      "Avanti works because it already feels like the pregame. The group can meet, eat, and start the night in one of Denver's strongest nightlife pockets before boarding together.",
    bestFor: "RiNo groups and nightlife-first riders who want the pre-show social part built in.",
    localAngle:
      "The Avanti page should feel like the pre-party version of the shuttle decision.",
    localGuideIntro:
      "If your group wants the night to start before the gates open, Avanti is one of the cleanest launch points. Rally there, walk to pickup, and keep the whole group on the same plan.",
    nearbySpots: [
      { name: "Avanti F&B", note: "Food hall energy right before the ride." },
      { name: "Happy Camper", note: "Big-group pre-show option nearby." },
    ],
    faqLocationAnswer:
      "The Avanti-area pickup is planned around the RiNo pregame zone so groups can meet nearby and walk over together before departure.",
    shareImage: buildShareImage(
      "avanti denver red rocks shuttle nightlife",
      curatedImages.guideTransportation,
      "Avanti to Red Rocks shuttle",
    ),
    heroImageSrc: curatedImages.guideTransportation,
    heroImageAlt: "RiNo and Avanti pregame shuttle planning for Red Rocks",
  },
  "morrison-red-rocks-ride-options": {
    slug: "morrison-red-rocks-ride-options",
    locationName: "Morrison",
    landmarkName: "Morrison / lower-lot area",
    pickupLabel: "No-Hike Alternative",
    heroTitle: "The Best Ride Option from Morrison to Red Rocks",
    heroBody:
      "Skip the lower-lot chaos, parking anxiety, and uphill walk. Use a cleaner ride plan from Morrison and let the return happen on the same schedule after the show.",
    whyThisWorks:
      "Morrison is not about a huge downtown pregame. It is about reducing chaos near the venue itself. This is the right move for people who want a last-mile plan without the hike and parking stress.",
    bestFor: "Close-in riders who care more about drop-off convenience than full downtown departure vibes.",
    localAngle:
      "The Morrison page should feel like the smart logistics answer for people staying near the venue.",
    localGuideIntro:
      "Morrison riders usually are not asking for nightlife. They are asking how to avoid the lots, the walk, and the uncertainty after the show. This page should answer that directly.",
    nearbySpots: [
      { name: "The Cow", note: "Classic Morrison stop before heading uphill." },
      { name: "Red Rocks Beer Garden", note: "Simple pre-show stop in Morrison." },
    ],
    faqLocationAnswer:
      "Morrison pickup details are built around staying close to the venue while avoiding the most frustrating parking and post-show regrouping problems.",
    shareImage: buildShareImage(
      "morrison colorado red rocks ride options",
      curatedImages.redRocksVenue,
      "Morrison ride options for Red Rocks",
    ),
    heroImageSrc: curatedImages.redRocksVenue,
    heroImageAlt: "Red Rocks arrival context for Morrison ride planning",
  },
};

export const localGatewayPageList = Object.values(localGatewayPages);

export const comparisonRows = [
  {
    feature: "Cost",
    parr: "$59 fixed",
    uber: "$80-$150 with surge",
    driving: "Gas, parking, and the stress",
  },
  {
    feature: "Drop-off",
    parr: "Prime Red Rocks arrival flow",
    uber: "Lower-lot roulette",
    driving: "Depends how early you get there",
  },
  {
    feature: "Reliability",
    parr: "Guaranteed return",
    uber: "Driver availability varies",
    driving: "You are the whole plan",
  },
  {
    feature: "Night quality",
    parr: "Social and easy",
    uber: "Transactional",
    driving: "Someone has to stay responsible",
  },
] as const;

export const gatewayFaqs = [
  {
    question: "Can I bring drinks on the shuttle?",
    answer: "Yes, riders 21 and over can usually bring drinks as long as the group keeps the ride clean and respectful.",
  },
  {
    question: "What if the concert runs late?",
    answer: "The return is planned around the end of the show, so riders do not need to guess when to leave or hunt for a second ride in the dark.",
  },
  {
    question: "Is it really only $59?",
    answer: "Yes. Shared seats are fixed-price, so riders are not dealing with rideshare surge pricing or hidden post-show fees.",
  },
] as const;
