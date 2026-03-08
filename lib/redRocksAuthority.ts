export type RedRocksSection = {
  heading: string;
  paragraphs: string[];
};

export type RedRocksEntitySeed = {
  category: RedRocksEntity["category"] | "camping";
  slug: string;
  title: string;
  description: string;
  kicker: string;
  intro: string;
  directAnswer: string;
  ctaText: string;
  sections: RedRocksSection[];
  facts: Array<{ label: string; value: string }>;
  queryIntents: string[];
  related: Array<{ href: string; label: string } | string>;
};

export type RedRocksEntity = {
  slug: string;
  title: string;
  category: "concerts" | "geology" | "hiking" | "wildlife" | "transportation" | "visiting";
  entityType: "TouristAttraction" | "HikingTrail" | "MusicEvent" | "Thing";
  parent?: string;
  related: string[];
  facts: { label: string; value: string }[];
  factBlock: {
    category: string;
    location: string;
    bestFor: string;
    difficulty: string;
    season: string;
    distance: string;
    concertRelevance: string;
    transportationRelevance: string;
  };
  faqs: { q: string; a: string }[];
  coordinates?: { lat: number; lng: number };
  keywords: string[];
  queryIntents: string[];
  referenceLinks: {
    parentTopic?: string;
    siblingPages: string[];
    relatedEntities: string[];
    actionPage: string;
  };
  description: string;
  intro: string;
  directAnswer: string;
  kicker: string;
  ctaText: string;
  sections: RedRocksSection[];
  mapMarker?: {
    layer: "trails" | "seating" | "geology" | "parking" | "shuttle";
    x: number;
    y: number;
    blurb: string;
  };
};

const RED_ROCKS_ENTITY_SEEDS: RedRocksEntitySeed[] = [
  {
    category: "transportation",
    slug: "how-to-get-to-red-rocks",
    title: "How To Get To Red Rocks",
    description: "Transport planning for Red Rocks from departure through post-show return.",
    kicker: "Transportation",
    intro: "Use this page if you are going to a show and need the fastest path from planning to a confirmed ride.",
    directAnswer:
      "Pick transport mode now, lock arrival timing, and secure your return ride before demand spikes after the show.",
    ctaText: "Book your Red Rocks ride",
    facts: [
      { label: "Step 1", value: "Choose transport model" },
      { label: "Step 2", value: "Set arrival buffer" },
      { label: "Step 3", value: "Define return protocol" },
      { label: "Booking", value: "Use /find" },
    ],
    queryIntents: ["how to get to red rocks", "transportation to red rocks", "best way to get to red rocks"],
    sections: [
      {
        heading: "Mode Selection",
        paragraphs: [
          "Driving, rideshare, and shuttle each solve different constraints. Choose by reliability needs, not habit.",
          "Deciding late increases risk at peak demand windows.",
        ],
      },
      {
        heading: "Timing",
        paragraphs: [
          "Arrival should be earlier than city-venue instincts, especially on sold-out nights.",
          "Add extra buffer when weather or major traffic overlap is likely.",
        ],
      },
      {
        heading: "Return Flow",
        paragraphs: [
          "Set one pickup plan and one backup location before the show starts.",
          "Groups that pre-assign return rules leave faster and with less stress.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/red-rocks-shuttle", label: "Shuttle Guide" },
      { href: "/red-rocks/denver-to-red-rocks-transportation", label: "Denver Transport" },
    ],
  },
  {
    category: "transportation",
    slug: "red-rocks-shuttle",
    title: "Red Rocks Shuttle Guide",
    description: "Shuttle-focused planning page for pickup zones, timing, and group fit.",
    kicker: "Transportation",
    intro: "This is the primary booking page for riders who want a guaranteed, low-stress way in and out of Red Rocks.",
    directAnswer:
      "Shuttle is the most reliable choice for most concert nights because pickup timing and return flow are pre-planned before the encore rush.",
    ctaText: "Reserve shuttle seats",
    facts: [
      { label: "Best For", value: "Individuals, couples, small groups" },
      { label: "Strength", value: "Predictable post-show flow" },
      { label: "Tradeoff", value: "Less custom timing" },
      { label: "Action", value: "Book in /find" },
    ],
    queryIntents: ["red rocks shuttle", "shuttle to red rocks", "red rocks shuttle from denver"],
    sections: [
      {
        heading: "Why Shuttle Works",
        paragraphs: [
          "The core advantage is operational clarity: pickup point, schedule, and return logic are known before the show.",
          "That avoids the post-encore decision bottleneck most visitors underestimate.",
        ],
      },
      {
        heading: "Pickup and Schedule",
        paragraphs: [
          "Confirm pickup and return instructions early and share them with everyone in your party.",
          "Group-wide clarity is more important than last-minute convenience.",
        ],
      },
      {
        heading: "When To Choose Private Instead",
        paragraphs: [
          "If your group needs tight custom timing or door-to-door control, private options may fit better.",
          "Use shuttle when reliability and simplicity matter most.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/shuttle", label: "Shuttle Options" },
      { href: "/red-rocks/rideshare-vs-shuttle", label: "Rideshare vs Shuttle" },
    ],
  },
  {
    category: "transportation",
    slug: "denver-to-red-rocks-transportation",
    title: "Denver to Red Rocks Transportation",
    description: "How to plan dependable transportation from Denver to Red Rocks and back.",
    kicker: "Transportation",
    intro: "This is the commercial planning page for Denver riders who want a dependable round-trip, not a one-way guess.",
    directAnswer:
      "From Denver, the winning plan is simple: book round-trip transportation early so you are not trapped in post-show surge chaos.",
    ctaText: "Book Denver round-trip",
    facts: [
      { label: "Origin", value: "Denver metro" },
      { label: "Common Failure", value: "Unplanned return" },
      { label: "Mitigation", value: "Pre-arranged transport" },
      { label: "Booking", value: "Use /find" },
    ],
    queryIntents: ["denver to red rocks transportation", "how to get from denver to red rocks", "red rocks ride from denver"],
    sections: [
      {
        heading: "Outbound and Return Must Match",
        paragraphs: [
          "A one-way plan is not enough for Red Rocks nights. Return logistics determine total trip quality.",
          "Choose a mode that is still dependable at concert close.",
        ],
      },
      {
        heading: "Travel Time and Buffer",
        paragraphs: [
          "Traffic variability means departure windows should be conservative, especially on popular show dates.",
          "Protect enough margin for entry and seat movement.",
        ],
      },
      {
        heading: "Operational Checklist",
        paragraphs: [
          "Confirm meetup details before leaving Denver.",
          "Use one communication thread and one fallback point for all riders.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/how-to-get-to-red-rocks", label: "How To Get There" },
      { href: "/red-rocks/post-concert-transportation", label: "Post-Concert Transport" },
    ],
  },
  {
    category: "transportation",
    slug: "post-concert-transportation",
    title: "Red Rocks Post-Concert Transportation",
    description: "Post-show transportation guide with regroup and pickup strategy.",
    kicker: "Transportation",
    intro: "This page is for visitors who care most about getting home quickly after the show.",
    directAnswer:
      "Post-concert transport only works when your ride and meetup plan are already set before encore ends.",
    ctaText: "Guarantee your ride home",
    facts: [
      { label: "Critical Window", value: "Encore close" },
      { label: "Best Practice", value: "Predefined meetup" },
      { label: "Primary Risk", value: "Split group messaging" },
      { label: "Action", value: "Book in /find" },
    ],
    queryIntents: ["post concert transportation red rocks", "red rocks ride home", "how to leave red rocks after concert"],
    sections: [
      {
        heading: "Why Groups Get Stuck",
        paragraphs: [
          "Most delays come from unclear meetup assumptions and too many simultaneous decisions.",
          "A single protocol removes most of that friction.",
        ],
      },
      {
        heading: "Working Exit Protocol",
        paragraphs: [
          "Choose one primary and one backup location before the show starts.",
          "Assign one person to coordinate updates during exit movement.",
        ],
      },
      {
        heading: "Book Before Peak Demand",
        paragraphs: [
          "Pre-booking avoids surge-hour uncertainty and keeps your party on one plan.",
          "Treat this as mandatory for high-demand show nights.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/post-concert-exit-guide", label: "Exit Guide" },
      { href: "/red-rocks/parking", label: "Parking Guide" },
    ],
  },
  {
    category: "transportation",
    slug: "shuttle",
    title: "Red Rocks Shuttle Options",
    description: "Overview of shuttle options and when each option is the right fit.",
    kicker: "Transportation",
    intro: "Use this as the decision page before checkout.",
    directAnswer:
      "Choose shuttle when you want predictable return timing and lower decision load than self-driving or ad-hoc rideshare.",
    ctaText: "See shuttle options",
    facts: [
      { label: "Intent", value: "Shuttle-first planning" },
      { label: "Fit", value: "Reliability over improvisation" },
      { label: "Compare", value: "Shuttle vs rideshare vs drive" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["red rocks shuttle options", "best shuttle red rocks", "book red rocks shuttle"],
    sections: [
      {
        heading: "Selection Framework",
        paragraphs: [
          "Pick by group size and control needs first, then budget.",
          "The cheapest option is not always cheapest after delays and failed pickups.",
        ],
      },
      {
        heading: "Execution",
        paragraphs: [
          "Share pickup instructions with every rider before departure.",
          "Keep one backup contact plan for no-service moments.",
        ],
      },
      {
        heading: "When To Upgrade",
        paragraphs: [
          "Move to private options for strict timing or large-party coordination.",
          "Use shared shuttle for standard concert-night reliability.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/red-rocks-shuttle", label: "Shuttle Guide" },
      { href: "/red-rocks/denver-to-red-rocks-transportation", label: "Denver Transport" },
    ],
  },
  {
    category: "transportation",
    slug: "rideshare-vs-shuttle",
    title: "Rideshare vs Shuttle at Red Rocks",
    description: "Comparison guide for rideshare and shuttle reliability at Red Rocks.",
    kicker: "Transportation Compare",
    intro: "This page is for visitors deciding between flexibility and reliability.",
    directAnswer:
      "Rideshare can work on lighter nights, but shuttle is usually more reliable when demand spikes after encore.",
    ctaText: "Compare and book",
    facts: [
      { label: "Rideshare Strength", value: "Flexible booking" },
      { label: "Rideshare Risk", value: "Post-show volatility" },
      { label: "Shuttle Strength", value: "Structured return flow" },
      { label: "Conversion", value: "Use /find" },
    ],
    queryIntents: ["red rocks shuttle vs uber", "rideshare red rocks", "best way home from red rocks"],
    sections: [
      {
        heading: "Cost vs Certainty",
        paragraphs: [
          "Rideshare headline cost can look attractive before surge periods.",
          "Shuttle often wins on outcome certainty during peak release windows.",
        ],
      },
      {
        heading: "Pickup Dynamics",
        paragraphs: [
          "Rideshare depends on real-time supply; shuttle depends on pre-set operations.",
          "Choose based on your tolerance for uncertainty, not optimism.",
        ],
      },
      {
        heading: "Decision Rule",
        paragraphs: [
          "If you cannot afford a failed return plan, use shuttle or private service.",
          "If your group is flexible and risk-tolerant, rideshare may still be acceptable.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/shuttle", label: "Shuttle Options" },
      { href: "/red-rocks/post-concert-transportation", label: "Post-Concert Transport" },
    ],
  },

  {
    category: "concerts",
    slug: "seating-chart",
    title: "Red Rocks Seating Chart Guide",
    description: "Seat planning guide by movement effort, view priority, and exit strategy.",
    kicker: "Concert",
    intro: "Use this before choosing seats or planning arrival pace.",
    directAnswer:
      "The best seat choice depends on view goals, stair tolerance, and your post-show movement plan.",
    ctaText: "Match seats to ride plan",
    facts: [
      { label: "Focus", value: "Seat tradeoffs" },
      { label: "Constraint", value: "Stairs and pacing" },
      { label: "Planning Link", value: "Transport timing" },
      { label: "Next", value: "Use /find" },
    ],
    queryIntents: ["red rocks seating chart", "best seats red rocks", "red rocks rows and stairs"],
    sections: [
      {
        heading: "Seat Selection",
        paragraphs: [
          "Select seats by the experience your group wants and can sustain physically.",
          "Avoid assuming all sections feel equivalent once crowds move.",
        ],
      },
      {
        heading: "Stair Effort",
        paragraphs: [
          "Repeated movement can feel harder than expected at elevation.",
          "Build pace and break expectations into your group plan.",
        ],
      },
      {
        heading: "Exit Alignment",
        paragraphs: [
          "Seat location affects how quickly you can regroup and leave.",
          "Pair seat decisions with transportation strategy before show day.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/best-seats", label: "Best Seats" },
      { href: "/red-rocks/concert-guide", label: "Concert Guide" },
    ],
  },
  {
    category: "concerts",
    slug: "best-seats",
    title: "Best Seats at Red Rocks",
    description: "Scenario-based guide for choosing the best seats at Red Rocks.",
    kicker: "Concert",
    intro: "There is no single best seat for every group.",
    directAnswer:
      "Best seats are scenario-specific: prioritize view, movement comfort, or faster exit depending on your group.",
    ctaText: "Plan seats + ride",
    facts: [
      { label: "Core Rule", value: "Choose by scenario" },
      { label: "Inputs", value: "View, effort, exit" },
      { label: "Group Factor", value: "Mobility needs" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["best seats at red rocks", "where should i sit at red rocks", "red rocks seating tips"],
    sections: [
      {
        heading: "Scenario Planning",
        paragraphs: [
          "Define your top priority before ticket choice.",
          "Compromise is easier when the group agrees on one primary goal.",
        ],
      },
      {
        heading: "Group Comfort",
        paragraphs: [
          "Fit seat strategy to the slowest movement pace in your group.",
          "That prevents split exits and coordination loss late in the night.",
        ],
      },
      {
        heading: "Tie-In to Logistics",
        paragraphs: [
          "Seat choice changes exit flow, so transportation planning should follow immediately.",
          "Treat these as one system, not separate tasks.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/seating-chart", label: "Seating Chart" },
      { href: "/red-rocks/post-concert-exit-guide", label: "Exit Guide" },
    ],
  },
  {
    category: "concerts",
    slug: "concert-weather",
    title: "Red Rocks Concert Weather Guide",
    description: "Show-night weather planning for layers, timing, and movement.",
    kicker: "Concert Weather",
    intro: "Weather mistakes create avoidable stress at open-air venues.",
    directAnswer:
      "Plan for temperature swings and build extra transit buffer when weather conditions are unstable.",
    ctaText: "Secure ride for weather nights",
    facts: [
      { label: "Risk", value: "Fast weather changes" },
      { label: "Prep", value: "Layered carry" },
      { label: "Flow Impact", value: "Ingress and egress pace" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["red rocks concert weather", "what to wear red rocks concert", "weather at red rocks tonight"],
    sections: [
      {
        heading: "Forecast Discipline",
        paragraphs: [
          "Re-check forecast on show day and before departure.",
          "Conditions can shift enough to change packing and timing decisions.",
        ],
      },
      {
        heading: "Layer Strategy",
        paragraphs: [
          "Pack compact layers that preserve movement and compliance with entry rules.",
          "Avoid overpacking that slows screening and seating transitions.",
        ],
      },
      {
        heading: "Transport Impact",
        paragraphs: [
          "Weather slows movement and can increase rideshare demand spikes.",
          "Pre-arranged rides reduce exposure to those spikes.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/best-time-to-visit", label: "Best Time To Visit" },
      { href: "/red-rocks/transportation", label: "Transportation" },
    ],
  },
  {
    category: "concerts",
    slug: "concert-season",
    title: "Red Rocks Concert Season Guide",
    description: "Planning guide for seasonal differences in demand, weather, and logistics.",
    kicker: "Concert Season",
    intro: "Seasonality changes both weather and crowd behavior.",
    directAnswer:
      "Best concert-season planning combines date windows with transport certainty and weather-aware pacing.",
    ctaText: "Plan this season",
    facts: [
      { label: "Variable", value: "Demand by month" },
      { label: "Variable", value: "Weather range" },
      { label: "Need", value: "Early logistics planning" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["red rocks concert season", "best month for red rocks concert", "red rocks show planning"],
    sections: [
      {
        heading: "Demand Patterns",
        paragraphs: [
          "Popular dates compress ingress and exit windows more aggressively.",
          "Assume higher friction and plan earlier on known high-demand events.",
        ],
      },
      {
        heading: "Seasonal Conditions",
        paragraphs: [
          "Temperature and weather variability affect comfort and movement pace.",
          "Adjust carry plan and timing by month rather than reusing one template.",
        ],
      },
      {
        heading: "Execution",
        paragraphs: [
          "Set transportation during ticket planning, not on event day.",
          "Use weekly schedule pages for final pre-show checks.",
        ],
      },
    ],
    related: [
      { href: "/week/red-rocks", label: "This Week at Red Rocks" },
      { href: "/red-rocks/best-time-to-visit", label: "Best Time To Visit" },
    ],
  },
  {
    category: "concerts",
    slug: "best-time-to-visit",
    title: "Best Time To Visit Red Rocks",
    description: "Season and timing guide for concerts, hikes, and lower-stress Red Rocks trips.",
    kicker: "Visit Planning",
    intro: "Use this to choose dates and time windows that maximize experience quality and minimize friction.",
    directAnswer:
      "The best time to visit depends on your goal: daytime comfort for hiking, early buffer for concerts, and season-aware transport planning for both.",
    ctaText: "Plan and book your ride",
    facts: [
      { label: "Decision Driver", value: "Visit purpose" },
      { label: "Daytime Comfort", value: "Early/late windows" },
      { label: "Concert Priority", value: "Arrival buffer" },
      { label: "Next Step", value: "Use /find" },
    ],
    queryIntents: ["best time to visit red rocks", "when to go to red rocks", "red rocks best season"],
    sections: [
      {
        heading: "Choose By Purpose",
        paragraphs: [
          "For hikes and sightseeing, target cooler windows and lower midday stress.",
          "For concerts, prioritize show-night timing reliability and transport certainty.",
        ],
      },
      {
        heading: "Seasonal Tradeoffs",
        paragraphs: [
          "Season changes affect weather comfort, crowd density, and trip pacing.",
          "High-demand weekends require earlier arrival and stronger return planning.",
        ],
      },
      {
        heading: "Conversion Rule",
        paragraphs: [
          "Once your date window is chosen, lock transportation immediately.",
          "Delaying ride decisions creates avoidable post-show risk.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/concert-season", label: "Concert Season Guide" },
      { href: "/red-rocks/how-to-get-to-red-rocks", label: "How To Get To Red Rocks" },
    ],
  },
  {
    category: "concerts",
    slug: "bag-policy",
    title: "Red Rocks Bag Policy Guide",
    description: "Entry-focused bag policy planning guide for Red Rocks concerts.",
    kicker: "Concert Logistics",
    intro: "This page helps you clear entry faster and avoid preventable gate delays.",
    directAnswer:
      "Bring only compliant essentials; bag discipline reduces line friction and protects your pre-show timing.",
    ctaText: "Book ride after policy check",
    facts: [
      { label: "Primary Goal", value: "Faster entry" },
      { label: "Best Practice", value: "Carry lighter" },
      { label: "Main Risk", value: "Screening delays" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["red rocks bag policy", "what can i bring to red rocks", "red rocks prohibited items"],
    sections: [
      {
        heading: "Policy-First Packing",
        paragraphs: [
          "Plan your carry setup around compliance and speed, not convenience alone.",
          "Overpacked bags increase inspection time and compress your pre-show margin.",
        ],
      },
      {
        heading: "Group Coordination",
        paragraphs: [
          "If one member is delayed at entry, the full group schedule shifts.",
          "Align bag expectations before departure to avoid gate surprises.",
        ],
      },
      {
        heading: "After Entry",
        paragraphs: [
          "Once bag decisions are settled, focus on seats, regrouping, and return transport.",
          "Smooth entry only pays off when return logistics are also pre-planned.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/concert-guide", label: "Concert Guide" },
      { href: "/red-rocks/post-concert-transportation", label: "Post-Concert Transportation" },
    ],
  },
  {
    category: "concerts",
    slug: "post-concert-exit-guide",
    title: "Red Rocks Post-Concert Exit Guide",
    description: "Exit strategy guide with regroup protocol and movement sequencing.",
    kicker: "Exit Strategy",
    intro: "This page is for groups that want a clean post-show closeout.",
    directAnswer:
      "Set one meetup protocol before the encore to avoid split-party delays at peak crowd release.",
    ctaText: "Guarantee ride home",
    facts: [
      { label: "Critical Step", value: "Predefine meetup" },
      { label: "Failure Mode", value: "Ad-hoc messaging" },
      { label: "Best Fix", value: "Single coordinator" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["post concert exit red rocks", "red rocks encore exit", "best way to leave red rocks"],
    sections: [
      {
        heading: "What Breaks",
        paragraphs: [
          "Most delays are communication failures under crowd pressure.",
          "Two competing meetup assumptions can cost significant time.",
        ],
      },
      {
        heading: "What Works",
        paragraphs: [
          "One primary location, one backup, one coordinator.",
          "Commit to the plan before the final set phase.",
        ],
      },
      {
        heading: "Connect to Transport",
        paragraphs: [
          "Exit plan and ride plan should be designed together.",
          "If one changes, immediately update the other.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/post-concert-transportation", label: "Post-Concert Transport" },
      { href: "/red-rocks/parking", label: "Parking" },
    ],
  },
  {
    category: "concerts",
    slug: "acoustics",
    title: "Red Rocks Acoustics Guide",
    description: "How natural amphitheater geometry and sandstone shape the Red Rocks listening experience.",
    kicker: "Acoustics",
    intro: "This page explains why Red Rocks sounds different from standard venues.",
    directAnswer:
      "Red Rocks acoustics are driven by natural rock geometry and open-air conditions, not only sound system power.",
    ctaText: "Plan your concert night",
    facts: [
      { label: "Core Driver", value: "Natural bowl geometry" },
      { label: "Material", value: "Sandstone reflections" },
      { label: "Variable", value: "Wind and atmosphere" },
      { label: "Planning Link", value: "Seats + transport" },
    ],
    queryIntents: ["red rocks acoustics", "why red rocks sounds good", "red rocks sound quality"],
    sections: [
      {
        heading: "Why It Sounds Unique",
        paragraphs: [
          "Rock form and venue orientation create a distinct perceived depth and projection profile.",
          "This is one reason performers and fans treat Red Rocks as a destination venue.",
        ],
      },
      {
        heading: "What Changes Night to Night",
        paragraphs: [
          "Open-air conditions introduce weather-influenced listening differences.",
          "Seat position and movement can shift perception across the same performance.",
        ],
      },
      {
        heading: "Planning Takeaway",
        paragraphs: [
          "Pair acoustic expectations with seating strategy and logistics timing.",
          "Sound experience is best when the rest of the night is operationally smooth.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/seating-chart", label: "Seating Chart" },
      { href: "/red-rocks/concert-guide", label: "Concert Guide" },
    ],
  },
  {
    category: "concerts",
    slug: "best-concerts-ever",
    title: "Best Red Rocks Concerts Ever",
    description: "Historical highlight page for iconic Red Rocks performances.",
    kicker: "Concert History",
    intro: "This page captures fan-intent and routes it into current planning.",
    directAnswer:
      "Iconic Red Rocks shows stand out because the performance and venue environment amplify each other in ways few venues can match.",
    ctaText: "Find upcoming nights",
    facts: [
      { label: "Intent", value: "Fan discovery" },
      { label: "Format", value: "Historic highlights" },
      { label: "Bridge", value: "Past to upcoming shows" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["best red rocks concerts", "famous red rocks shows", "historic performances red rocks"],
    sections: [
      {
        heading: "Why This Page Performs",
        paragraphs: [
          "Fans researching legendary nights are often high-intent for future attendance.",
          "That makes this a strong top-of-funnel asset for concert conversion paths.",
        ],
      },
      {
        heading: "How To Use It",
        paragraphs: [
          "Explore highlights, then transition into current schedule and transportation plans.",
          "The page is designed to convert nostalgia into practical action.",
        ],
      },
      {
        heading: "Conversion Path",
        paragraphs: [
          "After discovery, move to weekly listings and secure transportation early.",
          "That protects the experience quality fans expect from destination shows.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/concerts", label: "Concerts" },
      { href: "/week/red-rocks", label: "This Week at Red Rocks" },
    ],
  },

  {
    category: "hiking",
    slug: "red-rocks-trail",
    title: "Red Rocks Trail Guide",
    description: "Long-route trail guide for Red Rocks with pacing and effort context.",
    kicker: "Trail",
    intro: "Best for visitors wanting more mileage than short scenic loops.",
    directAnswer:
      "Red Rocks Trail is a longer route choice and should be planned with weather, hydration, and same-day schedule limits.",
    ctaText: "Plan concert ride after hike",
    facts: [
      { label: "Route Type", value: "Longer connector" },
      { label: "Effort", value: "Moderate to sustained" },
      { label: "Best For", value: "Extended day plans" },
      { label: "Show Pairing", value: "Only with recovery buffer" },
    ],
    queryIntents: ["red rocks trail difficulty", "red rocks trail map", "red rocks trail distance"],
    sections: [
      {
        heading: "Route Fit",
        paragraphs: [
          "This trail is better for visitors with flexible schedules and steady pacing discipline.",
          "Avoid it on compressed days where show logistics already have low margin.",
        ],
      },
      {
        heading: "Effort Management",
        paragraphs: [
          "Heat and elevation can increase perceived effort quickly.",
          "Use conservative pacing early and preserve reserve energy.",
        ],
      },
      {
        heading: "Day Integration",
        paragraphs: [
          "If attending a show later, finish early enough for full reset and transit.",
          "Do not trade recovery time for extra mileage on event days.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/hiking-trails", label: "All Hiking Trails" },
      { href: "/red-rocks/morrison-slide-trail", label: "Morrison Slide Trail" },
    ],
  },
  {
    category: "hiking",
    slug: "morrison-slide-trail",
    title: "Morrison Slide Trail Guide",
    description: "Practical route guide for Morrison Slide Trail near Red Rocks.",
    kicker: "Trail",
    intro: "Great for visitors wanting a specific long-tail trail route page.",
    directAnswer:
      "Morrison Slide Trail is best treated as a dedicated hike with clear pacing and hydration planning.",
    ctaText: "Book ride for show night",
    facts: [
      { label: "Route Type", value: "Trail connector" },
      { label: "Best Use", value: "Focused day hike" },
      { label: "Risk", value: "Heat and effort underestimation" },
      { label: "Show Pair", value: "Possible with early finish" },
    ],
    queryIntents: ["morrison slide trail", "morrison slide trail map", "morrison slide trail red rocks"],
    sections: [
      {
        heading: "Planning Basics",
        paragraphs: [
          "Treat this as a planned route rather than a quick add-on.",
          "Bring enough water and monitor pace against conditions.",
        ],
      },
      {
        heading: "When To Choose It",
        paragraphs: [
          "Choose on days with flexible timing and stable weather windows.",
          "Avoid stacking with tight same-night concert schedules.",
        ],
      },
      {
        heading: "Operational Tie-In",
        paragraphs: [
          "If your day includes a show, transition early into transport logistics.",
          "Protect recovery before entry lines and venue stairs.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/red-rocks-trail", label: "Red Rocks Trail" },
      { href: "/red-rocks/visiting-guide", label: "Visiting Guide" },
    ],
  },
  {
    category: "hiking",
    slug: "mount-vernon-trail",
    title: "Mount Vernon Trail Near Red Rocks",
    description: "Route-fit guide for Mount Vernon area hiking paired with Red Rocks visits.",
    kicker: "Trail",
    intro: "Use this when building a broader foothills day around Red Rocks.",
    directAnswer:
      "Mount Vernon area routes are best for longer day itineraries with generous transition time before any evening show.",
    ctaText: "Set evening transport",
    facts: [
      { label: "Trip Type", value: "Regional hike + venue plan" },
      { label: "Constraint", value: "Transition time" },
      { label: "Effort", value: "Steady pacing" },
      { label: "Concert Fit", value: "Only with strong buffer" },
    ],
    queryIntents: ["mount vernon trail red rocks", "trails near red rocks amphitheatre", "mount vernon hike colorado"],
    sections: [
      {
        heading: "Route Scope",
        paragraphs: [
          "Treat these as regional hike plans rather than quick in-park loops.",
          "The reward is broader terrain variety with more planning needs.",
        ],
      },
      {
        heading: "Time Budget",
        paragraphs: [
          "Drive and transition windows can be the limiting factor.",
          "Conservative scheduling protects both hike quality and concert logistics.",
        ],
      },
      {
        heading: "Execution",
        paragraphs: [
          "Complete hike, recover, then move into parking or shuttle plan.",
          "Do not compress these phases on high-demand show nights.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/hiking-trails", label: "Hiking Trails" },
      { href: "/red-rocks/how-to-get-to-red-rocks", label: "How To Get There" },
    ],
  },

  {
    category: "geology",
    slug: "why-red-rocks-are-red",
    title: "Why Are Red Rocks Red?",
    description: "Plain-language geology explanation of Red Rocks coloration.",
    kicker: "Geology",
    intro: "High-intent direct-answer page for one of the most searched geology questions.",
    directAnswer:
      "Red Rocks are red mainly due to iron oxide in sandstone layers shaped and exposed over geologic time.",
    ctaText: "Plan your Red Rocks night",
    facts: [
      { label: "Primary Cause", value: "Iron oxide" },
      { label: "Rock Type", value: "Sandstone" },
      { label: "Process", value: "Deposition + uplift + erosion" },
      { label: "Companion", value: "Geology guide" },
    ],
    queryIntents: ["why are red rocks red", "red rocks color geology", "iron oxide red rocks"],
    sections: [
      {
        heading: "Simple Explanation",
        paragraphs: [
          "Iron-bearing minerals oxidized in sedimentary layers, producing red and orange tones.",
          "This chemical process is similar to rusting but over geologic timescales.",
        ],
      },
      {
        heading: "Why It Looks Dramatic",
        paragraphs: [
          "Rock geometry and changing light conditions amplify color contrast.",
          "The effect is especially visible in sunrise, sunset, and stage-lit conditions.",
        ],
      },
      {
        heading: "Where To Go Next",
        paragraphs: [
          "Use geology and trail pages for deeper context and field observation.",
          "Then transition to transportation planning if attending a show.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/geology", label: "Geology Guide" },
      { href: "/red-rocks/fountain-formation", label: "Fountain Formation" },
    ],
  },
  {
    category: "geology",
    slug: "fountain-formation",
    title: "Fountain Formation at Red Rocks",
    description: "How the Fountain Formation explains Red Rocks terrain and color.",
    kicker: "Geology",
    intro: "This page connects geology terms to what visitors can actually see on-site.",
    directAnswer:
      "Fountain Formation sedimentary layers are central to Red Rocks' visible sandstone structure and red color profile.",
    ctaText: "Plan visit and ride",
    facts: [
      { label: "Formation", value: "Fountain Formation" },
      { label: "Material", value: "Sandstone-rich deposits" },
      { label: "Visual Cue", value: "Tilted red layers" },
      { label: "Use", value: "Geology + trail context" },
    ],
    queryIntents: ["fountain formation red rocks", "red rocks sandstone formation", "geology of red rocks colorado"],
    sections: [
      {
        heading: "What It Explains",
        paragraphs: [
          "Formation context helps explain both the visual signature and terrain behavior at Red Rocks.",
          "It is the bridge between geology vocabulary and practical site understanding.",
        ],
      },
      {
        heading: "Color and Structure",
        paragraphs: [
          "Iron oxidation and sediment history combine to produce recognizable tones and layering.",
          "Tilt and exposure patterns reveal regional uplift history.",
        ],
      },
      {
        heading: "Visitor Application",
        paragraphs: [
          "Use this context on hikes and overlook stops for better field interpretation.",
          "Then move to route and logistics pages for full trip execution.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/why-red-rocks-are-red", label: "Why Red Rocks Are Red" },
      { href: "/red-rocks/dinosaur-history", label: "Dinosaur History" },
    ],
  },
  {
    category: "geology",
    slug: "dinosaur-history",
    title: "Dinosaur History Near Red Rocks",
    description: "Paleontology-adjacent planning page for visitors exploring dinosaur-era context near Red Rocks.",
    kicker: "Geology and History",
    intro: "Educational pages like this pull high-intent day-visit traffic.",
    directAnswer:
      "Nearby dinosaur-history sites complement Red Rocks geology and are best planned as part of a structured daytime itinerary.",
    ctaText: "Add show transportation",
    facts: [
      { label: "Context", value: "Regional paleontology" },
      { label: "Companion Stop", value: "Dinosaur Ridge area" },
      { label: "Best Use", value: "Family and educational trips" },
      { label: "Evening Link", value: "Concert transport planning" },
    ],
    queryIntents: ["dinosaur history red rocks", "dinosaur ridge red rocks", "prehistoric red rocks colorado"],
    sections: [
      {
        heading: "Why This Page Exists",
        paragraphs: [
          "Visitors often search Red Rocks as part of a broader educational day.",
          "This page captures that intent and routes it into practical planning.",
        ],
      },
      {
        heading: "Day Planning",
        paragraphs: [
          "Use morning windows for geology/paleontology stops and keep afternoon pace realistic.",
          "Avoid overloading the day if a concert is scheduled at night.",
        ],
      },
      {
        heading: "Bridge to Operations",
        paragraphs: [
          "Educational intent and concert intent can coexist when schedule phases are explicit.",
          "Set transport details before venue arrival.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/fountain-formation", label: "Fountain Formation" },
      { href: "/red-rocks/visiting-guide", label: "Visiting Guide" },
    ],
  },

  {
    category: "wildlife",
    slug: "birds",
    title: "Birds at Red Rocks",
    description: "Birdwatching guide with visibility windows and route pacing tips.",
    kicker: "Wildlife",
    intro: "Bird pages are strong long-tail authority assets for Red Rocks nature traffic.",
    directAnswer:
      "Birdwatching is strongest in lower-traffic windows with slower route pacing and stable observation points.",
    ctaText: "Plan show ride after day visit",
    facts: [
      { label: "Focus", value: "Birdwatching" },
      { label: "Best Time", value: "Lower-traffic windows" },
      { label: "Tool", value: "Binoculars" },
      { label: "Companion", value: "Hawks page" },
    ],
    queryIntents: ["birds at red rocks", "birdwatching red rocks", "red rocks raptors"],
    sections: [
      {
        heading: "Observation Method",
        paragraphs: [
          "Choose one or two stable viewpoints instead of rushing between stops.",
          "Lower pace generally produces better sightings.",
        ],
      },
      {
        heading: "Conditions",
        paragraphs: [
          "Wind, cloud cover, and time of day all influence activity.",
          "Treat each outing as variable rather than guaranteed.",
        ],
      },
      {
        heading: "Trip Integration",
        paragraphs: [
          "Birdwatching combines well with moderate trails and early-day timing.",
          "Transition to evening logistics early if attending concerts.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/birds", label: "Birds" },
      { href: "/red-rocks/wildlife", label: "Wildlife Guide" },
    ],
  },
  {
    category: "wildlife",
    slug: "plants",
    title: "Plants at Red Rocks",
    description: "Plant and habitat guide for Red Rocks with seasonal context.",
    kicker: "Nature",
    intro: "Plant pages increase nature-intent reach beyond concert-only keywords.",
    directAnswer:
      "Plant visibility shifts by season and conditions, and staying on marked routes is the best way to protect habitat.",
    ctaText: "Plan concert transportation",
    facts: [
      { label: "Focus", value: "Flora and habitat" },
      { label: "Seasonality", value: "High" },
      { label: "Best Practice", value: "Stay on trails" },
      { label: "Related", value: "Wildlife + hiking" },
    ],
    queryIntents: ["plants at red rocks", "red rocks flora", "wildflowers red rocks"],
    sections: [
      {
        heading: "Habitat Basics",
        paragraphs: [
          "Different slope and moisture zones support different plant communities.",
          "Responsible viewing preserves those zones for future visitors.",
        ],
      },
      {
        heading: "Seasonal Variation",
        paragraphs: [
          "Plant visibility and color change throughout the year.",
          "Repeat visits can produce very different experiences.",
        ],
      },
      {
        heading: "Planning Link",
        paragraphs: [
          "Pair plant observation with moderate hiking routes.",
          "If finishing with a concert, transition to transport prep early.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/wildlife", label: "Wildlife Guide" },
      { href: "/red-rocks/hiking-trails", label: "Hiking Trails" },
    ],
  },
  {
    category: "wildlife",
    slug: "hawks",
    title: "Hawks at Red Rocks",
    description: "Raptor-focused birdwatching guide for Red Rocks with timing and viewing tactics.",
    kicker: "Wildlife",
    intro: "Hawk and raptor pages are strong long-tail entries for nature search demand.",
    directAnswer:
      "Hawk sightings are strongest when you use lower-traffic windows and stable viewpoints along open ridge sightlines.",
    ctaText: "Plan your show transport",
    facts: [
      { label: "Focus", value: "Raptors and hawks" },
      { label: "Best Window", value: "Calmer, lower-traffic periods" },
      { label: "Method", value: "Slow pace + fixed viewpoints" },
      { label: "Bridge", value: "Wildlife to concert logistics" },
    ],
    queryIntents: ["hawks at red rocks", "raptors at red rocks", "birdwatching red rocks hawks"],
    sections: [
      {
        heading: "Where Hawks Are Commonly Observed",
        paragraphs: [
          "Raptors are often spotted where wind and thermal movement support gliding and scanning behavior.",
          "Open-view areas and ridge sightlines improve observation quality for patient viewers.",
        ],
      },
      {
        heading: "Viewing Setup",
        paragraphs: [
          "Use binoculars, keep movement minimal, and avoid rapid route changes while scanning.",
          "Treat sightings as variable outcomes, not guaranteed time slots.",
        ],
      },
      {
        heading: "Trip Integration",
        paragraphs: [
          "Hawk-focused viewing pairs well with moderate daytime routes and early windows.",
          "If attending a concert, finalize transportation before shifting into venue movement.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/birds", label: "Birds" },
      { href: "/red-rocks/wildlife", label: "Wildlife Guide" },
    ],
  },
  {
    category: "wildlife",
    slug: "mule-deer",
    title: "Mule Deer at Red Rocks",
    description: "Where mule deer are commonly seen and how to observe responsibly.",
    kicker: "Wildlife",
    intro: "One of the highest-intent wildlife pages for Red Rocks visitors.",
    directAnswer:
      "Mule deer are common at Red Rocks in quieter windows; observe from distance and never feed wildlife.",
    ctaText: "Plan your concert return",
    facts: [
      { label: "Species", value: "Mule deer" },
      { label: "Best Window", value: "Lower-traffic periods" },
      { label: "Rule", value: "Observe, do not approach" },
      { label: "Pair", value: "Trail and transport pages" },
    ],
    queryIntents: ["mule deer red rocks", "animals at red rocks park", "red rocks wildlife deer"],
    sections: [
      {
        heading: "Where Sightings Happen",
        paragraphs: [
          "Deer are often seen near transition areas between open and brush-covered zones.",
          "Visibility changes with season and crowd pressure.",
        ],
      },
      {
        heading: "Observation Safety",
        paragraphs: [
          "Maintain a clear distance and avoid influencing movement.",
          "No feeding and no close-range photo pursuit.",
        ],
      },
      {
        heading: "Trip Use",
        paragraphs: [
          "This page works best when paired with hiking and wildlife overview pages.",
          "For concert nights, finalize transport before venue ingress.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/wildlife", label: "Wildlife Guide" },
      { href: "/red-rocks/red-rocks-trail", label: "Red Rocks Trail" },
    ],
  },
  {
    category: "wildlife",
    slug: "rattlesnakes",
    title: "Are There Rattlesnakes at Red Rocks?",
    description: "Trail safety guide for snake awareness at Red Rocks.",
    kicker: "Wildlife Safety",
    intro: "A high-value safety query page that should always be practical and calm.",
    directAnswer:
      "Snake encounters are possible in warm periods, so trail-edge awareness and calm response behavior are essential.",
    ctaText: "Finish with a reliable ride",
    facts: [
      { label: "Topic", value: "Trail safety" },
      { label: "Seasonality", value: "Higher in warm weather" },
      { label: "Best Practice", value: "Watch step placement" },
      { label: "Response", value: "Back away calmly" },
    ],
    queryIntents: ["snakes at red rocks", "rattlesnakes red rocks", "red rocks trail safety"],
    sections: [
      {
        heading: "Risk Context",
        paragraphs: [
          "Most hikes are uneventful, but awareness should be part of warm-weather route planning.",
          "Staying on marked trails lowers exposure and uncertainty.",
        ],
      },
      {
        heading: "If You See a Snake",
        paragraphs: [
          "Stop, give space, and let the animal move naturally.",
          "Do not attempt to approach or handle wildlife.",
        ],
      },
      {
        heading: "Preventive Planning",
        paragraphs: [
          "Use proper footwear and maintain situational awareness at trail edges.",
          "Pair safety planning with hydration and weather prep.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/wildlife", label: "Wildlife Guide" },
      { href: "/red-rocks/hiking-trails", label: "Hiking Trails" },
    ],
  },

  {
    category: "geology",
    slug: "sandstone",
    title: "Red Rocks Sandstone Guide",
    description: "How sandstone layers at Red Rocks formed and why they shape terrain, color, and visitor experience.",
    kicker: "Geology",
    intro: "Sandstone-specific pages capture direct geology intent while supporting trail and visit planning.",
    directAnswer:
      "Red Rocks sandstone formed through long sediment deposition and compaction, then was exposed by uplift and erosion into the iconic amphitheatre landscape.",
    ctaText: "Plan your Red Rocks ride",
    facts: [
      { label: "Rock Type", value: "Sedimentary sandstone" },
      { label: "Formation", value: "Deposition + compaction" },
      { label: "Exposure", value: "Uplift and erosion" },
      { label: "Visitor Value", value: "Terrain and context" },
    ],
    queryIntents: ["red rocks sandstone", "sandstone formation red rocks", "how sandstone formed at red rocks"],
    sections: [
      {
        heading: "What Sandstone Explains",
        paragraphs: [
          "Sandstone structure helps explain both visual identity and route experience at Red Rocks.",
          "Layering and exposure patterns are visible across trails and amphitheatre viewpoints.",
        ],
      },
      {
        heading: "Color and Texture Context",
        paragraphs: [
          "Iron-rich minerals and weathering processes contribute to red tones and surface variability.",
          "Differences in light and moisture can make sandstone color appear to shift through the day.",
        ],
      },
      {
        heading: "Planning Tie-In",
        paragraphs: [
          "Understanding sandstone terrain supports better route pacing and footwear choices.",
          "For concert visits, geology context also explains stair effort and movement patterns.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/fountain-formation", label: "Fountain Formation" },
      { href: "/red-rocks/why-red-rocks-are-red", label: "Why Red Rocks Are Red" },
    ],
  },
  {
    category: "geology",
    slug: "iron-oxide",
    title: "Iron Oxide at Red Rocks",
    description: "Why iron oxide is central to Red Rocks coloration and how it connects to the site's geologic story.",
    kicker: "Geology",
    intro: "Iron-oxide pages target the exact query users ask when they first see Red Rocks color.",
    directAnswer:
      "Iron oxide is the primary pigment source behind Red Rocks' red coloration in exposed sandstone layers.",
    ctaText: "Plan your next Red Rocks night",
    facts: [
      { label: "Primary Role", value: "Color driver" },
      { label: "Material Context", value: "Sandstone matrix" },
      { label: "Visual Result", value: "Red/orange tones" },
      { label: "Companion Topic", value: "Fountain Formation" },
    ],
    queryIntents: ["iron oxide at red rocks", "why is red rocks red iron oxide", "red rocks red color explanation"],
    sections: [
      {
        heading: "Simple Chemistry",
        paragraphs: [
          "Iron oxidation in rock is conceptually similar to rusting, but over geological time scales.",
          "At Red Rocks, this process is one of the clearest explanations for the site's color identity.",
        ],
      },
      {
        heading: "Why Visitors Notice It",
        paragraphs: [
          "Color contrast intensifies with lighting angle and surface exposure, making the effect highly visible.",
          "This is why sunrise, sunset, and stage-lit conditions can feel especially dramatic.",
        ],
      },
      {
        heading: "From Curiosity to Planning",
        paragraphs: [
          "Use this page as a direct-answer geology stop, then move to trail or concert planning pages.",
          "When your visit includes a show, lock transportation early for a smoother full-night experience.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/why-red-rocks-are-red", label: "Why Red Rocks Are Red" },
      { href: "/red-rocks/sandstone", label: "Sandstone" },
    ],
  },
  {
    category: "camping",
    slug: "camping-near-red-rocks",
    title: "Camping Near Red Rocks",
    description: "How to plan camping near Red Rocks while keeping concert transport separate and reliable.",
    kicker: "Camping",
    intro: "Camping content captures high-intent trip planners who may also attend concerts.",
    directAnswer:
      "Camping is not allowed inside Red Rocks Park, so plan nearby campgrounds and separate your show-night transportation flow.",
    ctaText: "Book concert transportation",
    facts: [
      { label: "Inside Park Camping", value: "Not allowed" },
      { label: "Best Practice", value: "Separate lodging and transport plans" },
      { label: "Primary Risk", value: "Late-night return friction" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["camping near red rocks", "can you camp at red rocks", "camping options near red rocks"],
    sections: [
      {
        heading: "What To Know First",
        paragraphs: [
          "Red Rocks Park itself does not allow overnight camping.",
          "Choose nearby sites based on check-in rules and return-hour compatibility.",
        ],
      },
      {
        heading: "Concert-Night Workflow",
        paragraphs: [
          "Treat campground logistics and concert transportation as two linked but separate systems.",
          "Reliable return planning is critical after late shows.",
        ],
      },
      {
        heading: "Execution",
        paragraphs: [
          "Confirm campground constraints, then lock your ride plan.",
          "Avoid ad-hoc decisions after concert close.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/camping-nearby", label: "Camping Nearby" },
      { href: "/red-rocks/post-concert-transportation", label: "Post-Concert Transport" },
    ],
  },
  {
    category: "camping",
    slug: "best-campgrounds-near-red-rocks",
    title: "Best Campgrounds Near Red Rocks",
    description: "Selection framework for choosing campgrounds near Red Rocks with event-night practicality in mind.",
    kicker: "Camping",
    intro: "This page is a conversion bridge from lodging research into transportation booking.",
    directAnswer:
      "The best nearby campground is the one that matches your check-in rules, drive distance, and post-show return reality.",
    ctaText: "Set your ride plan",
    facts: [
      { label: "Decision Inputs", value: "Distance, rules, return timing" },
      { label: "Common Error", value: "Ignoring late-night logistics" },
      { label: "Best Practice", value: "Confirm both lodging and transport" },
      { label: "Action", value: "Use /find" },
    ],
    queryIntents: ["best campgrounds near red rocks", "where to camp near red rocks", "red rocks camping guide"],
    sections: [
      {
        heading: "Campground Selection",
        paragraphs: [
          "Choose campgrounds that align with your full trip timing, not just location preference.",
          "Late return compatibility is often the deciding factor after concerts.",
        ],
      },
      {
        heading: "Schedule Integration",
        paragraphs: [
          "Build a timeline from campsite departure through post-show return.",
          "Keep the timeline realistic under event-night traffic conditions.",
        ],
      },
      {
        heading: "Practical Closeout",
        paragraphs: [
          "Once campground choice is set, secure transport early.",
          "That prevents lodging plans from being undermined by return uncertainty.",
        ],
      },
    ],
    related: [
      { href: "/red-rocks/camping-near-red-rocks", label: "Camping Near Red Rocks" },
      { href: "/red-rocks/denver-to-red-rocks-transportation", label: "Denver Transportation" },
    ],
  },
];

const SEED_CATEGORY_TO_ENTITY: Record<RedRocksEntitySeed["category"], RedRocksEntity["category"]> = {
  transportation: "transportation",
  concerts: "concerts",
  hiking: "hiking",
  geology: "geology",
  wildlife: "wildlife",
  visiting: "visiting",
  camping: "visiting",
};

const CATEGORY_TO_PARENT: Record<RedRocksEntity["category"], string> = {
  transportation: "/red-rocks/transportation",
  concerts: "/red-rocks/concerts",
  hiking: "/red-rocks/hiking-trails",
  geology: "/red-rocks/geology",
  wildlife: "/red-rocks/wildlife",
  visiting: "/red-rocks/visiting-guide",
};

const CATEGORY_TO_SCHEMA: Record<RedRocksEntity["category"], RedRocksEntity["entityType"]> = {
  hiking: "HikingTrail",
  concerts: "MusicEvent",
  geology: "TouristAttraction",
  transportation: "Thing",
  wildlife: "Thing",
  visiting: "TouristAttraction",
};

const RED_ROCKS_COORDS = { lat: 39.6654, lng: -105.2057 } as const;

const MAP_MARKER_BY_SLUG: Partial<Record<string, NonNullable<RedRocksEntity["mapMarker"]>>> = {
  "trading-post-trail": { layer: "trails", x: 25, y: 70, blurb: "Most popular first-hike loop." },
  "red-rocks-trail": { layer: "trails", x: 18, y: 52, blurb: "Longer connector route." },
  "morrison-slide-trail": { layer: "trails", x: 11, y: 35, blurb: "Steadier effort route." },
  "seating-chart": { layer: "seating", x: 50, y: 68, blurb: "Main amphitheatre seating zone." },
  "best-seats": { layer: "seating", x: 58, y: 40, blurb: "Great views, higher stair load." },
  "why-red-rocks-are-red": { layer: "geology", x: 45, y: 56, blurb: "Iconic sandstone context." },
  "fountain-formation": { layer: "geology", x: 35, y: 43, blurb: "Core red sandstone formation." },
  "parking": { layer: "parking", x: 72, y: 26, blurb: "Upper lot strategy and arrival timing." },
  "parking-reality": { layer: "parking", x: 78, y: 72, blurb: "Exit tradeoffs and lot constraints." },
  "post-concert-transportation": { layer: "shuttle", x: 84, y: 48, blurb: "Primary post-show meetup corridor." },
  "post-show-pickup": { layer: "shuttle", x: 67, y: 61, blurb: "Backup pickup path." },
};

function normalizeRelated(related: RedRocksEntitySeed["related"]): string[] {
  return related.map((row) => (typeof row === "string" ? row : row.href));
}

function factValue(page: RedRocksEntitySeed, label: string): string | undefined {
  return page.facts.find((f) => f.label.toLowerCase() === label.toLowerCase())?.value;
}

function buildFactBlock(page: RedRocksEntitySeed, category: RedRocksEntity["category"]): RedRocksEntity["factBlock"] {
  const categoryLabel = category[0].toUpperCase() + category.slice(1);
  return {
    category: categoryLabel,
    location: "Red Rocks Amphitheatre & Park, Morrison, Colorado",
    bestFor:
      factValue(page, "Best For") ??
      (category === "hiking"
        ? "Trail planning and route selection"
        : category === "transportation"
          ? "Show-night arrival and exit planning"
          : "Red Rocks trip planning"),
    difficulty:
      factValue(page, "Difficulty") ??
      (category === "hiking" ? "Varies by trail and elevation" : "Low to moderate planning complexity"),
    season:
      factValue(page, "Season") ??
      (category === "concerts" || category === "transportation" ? "Peak demand during concert season (Apr-Oct)" : "Year-round"),
    distance:
      factValue(page, "Distance") ??
      (category === "transportation" ? "Denver to Red Rocks is roughly 15 miles (route dependent)" : "Varies by guide topic"),
    concertRelevance: category === "concerts" || category === "transportation" ? "High" : "Medium",
    transportationRelevance: category === "transportation" ? "High" : "Medium",
  };
}

function buildFaqs(page: RedRocksEntitySeed): Array<{ q: string; a: string }> {
  const first = page.sections[0]?.paragraphs[0] ?? page.directAnswer;
  return [
    { q: `What is ${page.title}?`, a: page.directAnswer },
    { q: `How does ${page.title} fit into a Red Rocks trip?`, a: first },
    { q: "Where should I go next?", a: "Open related guides, then compare ride options at /find." },
  ];
}

const BASE_RED_ROCKS_ENTITIES: RedRocksEntity[] = RED_ROCKS_ENTITY_SEEDS.map((page) => {
  const category = SEED_CATEGORY_TO_ENTITY[page.category];
  const parent = CATEGORY_TO_PARENT[category];
  const related = normalizeRelated(page.related);
  const queryIntents = page.queryIntents;
  return {
    slug: page.slug,
    title: page.title,
    description: page.description,
    intro: page.intro,
    directAnswer: page.directAnswer,
    kicker: page.kicker,
    ctaText: page.ctaText,
    category,
    entityType: CATEGORY_TO_SCHEMA[category],
    parent,
    related,
    facts: page.facts,
    factBlock: buildFactBlock(page, category),
    faqs: buildFaqs(page),
    coordinates: RED_ROCKS_COORDS,
    keywords: queryIntents,
    queryIntents,
    referenceLinks: {
      parentTopic: parent,
      siblingPages: [],
      relatedEntities: related,
      actionPage: "/find",
    },
    sections: page.sections,
    mapMarker: MAP_MARKER_BY_SLUG[page.slug],
  };
});

export const RED_ROCKS_ENTITIES: RedRocksEntity[] = BASE_RED_ROCKS_ENTITIES.map((entity) => {
  const siblingPages = BASE_RED_ROCKS_ENTITIES.filter(
    (candidate) => candidate.category === entity.category && candidate.slug !== entity.slug
  )
    .slice(0, 6)
    .map((candidate) => `/red-rocks/${candidate.slug}`);

  return {
    ...entity,
    referenceLinks: {
      ...entity.referenceLinks,
      siblingPages,
    },
  };
});

export const RED_ROCKS_ENTITY_BY_SLUG = new Map(
  RED_ROCKS_ENTITIES.map((entity) => [entity.slug, entity] as const)
);

export type RedRocksMapPoint = {
  id: string;
  name: string;
  layer: "trails" | "seating" | "geology" | "parking" | "shuttle";
  x: number;
  y: number;
  blurb: string;
};

export const RED_ROCKS_MAP_POINTS: RedRocksMapPoint[] = RED_ROCKS_ENTITIES.filter((entity) => entity.mapMarker).map(
  (entity) => ({
    id: entity.slug,
    name: entity.title,
    layer: entity.mapMarker!.layer,
    x: entity.mapMarker!.x,
    y: entity.mapMarker!.y,
    blurb: entity.mapMarker!.blurb,
  })
);
