import { NextResponse } from "next/server";

export const FORBIDDEN_URL_PII_FIELDS = [
  "name",
  "fullname",
  "first_name",
  "last_name",
  "passengername",
  "email",
  "phone",
  "weight",
  "weights",
  "passengerweight",
  "passengerweightlbs",
  "maxpassengerweightlbs",
  "accessibility",
  "mobilitynotes",
  "medicalnotes",
  "bookingref",
  "bookingreference",
  "confirmationnumber",
  "cabin",
  "cabinnumber",
  "stateroom",
  "stateroomnumber",
  "privatenotes",
  "internalnotes",
] as const;

export const PARTY_AT_RED_ROCKS_DCC_SITE_MANIFEST = {
  schema: "dcc.site-manifest.v1",
  version: "1.0.0",
  site_id: "partyatredrocks",
  site_name: "Party at Red Rocks",
  canonical_domains: ["partyatredrocks.com", "www.partyatredrocks.com"],
  aliases: ["parr", "party-at-red-rocks", "dcc:site:party-at-red-rocks"],
  consumer_role:
    "Red Rocks Amphitheatre concert transportation surface receiving event/date/party context from Brinkberry and DCC (strictly excluded from UI-less holds or autonomous booking pending inventory/payment authority audit)",
  dcc_universe_ids: ["univ:red-rocks-concert-shuttle:0.3.0"],
  accepted_context_fields: [
    "contextId",
    "eventDate",
    "partySize",
    "venueSlug",
    "pickupZone",
  ],
  emitted_context_fields: [
    "contextId",
    "eventDate",
    "partySize",
    "vehicleType",
  ],
  booking_authority: {
    primary: "direct_provider",
    supported_authorities: ["direct_provider"],
    takes_direct_payment: true,
    autonomous_booking_enabled: false,
    decision_authorization_mode: "shadow_only_no_side_effects",
    universal_multi_provider_checkout: false,
    finality_statement:
      "Party at Red Rocks accepts traveler-confirmed web reservations only; it is excluded from UI-less holds or agentic booking until inventory ownership, provider acceptance, payment, cancellation, and refund authority are audited.",
  },
  natural_relationships: {
    inbound: [
      {
        site_id: "brinkberry",
        canonical_domain: "brinkberry.com",
        journey_id: "brinkberry-to-party-at-red-rocks",
        relationship_type: "red_rocks_concert_transportation_handoff",
        context_exchange: "opaque_dcc_ctx",
      },
      {
        site_id: "destinationcommandcenter",
        canonical_domain: "destinationcommandcenter.com",
        journey_id: "dcc-to-party-at-red-rocks",
        relationship_type: "red_rocks_corridor_handoff",
        context_exchange: "opaque_dcc_ctx",
      },
    ],
    outbound: [
      {
        site_id: "destinationcommandcenter",
        canonical_domain: "destinationcommandcenter.com",
        journey_id: "party-at-red-rocks-to-dcc",
        relationship_type: "red_rocks_venue_intelligence",
        context_exchange: "opaque_dcc_ctx",
      },
    ],
  },
  commercial_channels: [
    {
      channel_id: "parr-direct-checkout",
      provider: "direct_provider",
      attribution_parameter: "dcc_handoff_id,utm_campaign",
      outcome_reporting: "direct_checkout_boundary",
      notes: "Human-confirmed checkout on partyatredrocks.com; no UI-less holds or autonomous execution.",
    },
  ],
  context_support: {
    mode: "private_trip_context",
    supports_private_trip_context: true,
    supports_public_shared_plans: false,
    cookie_name: "parr_trip_ctx",
    cookie_flags: "Secure; HttpOnly; SameSite=Lax",
    strips_token_from_url: true,
    url_pii_forbidden: true,
    forbidden_url_fields: FORBIDDEN_URL_PII_FIELDS,
  },
  privacy_and_security: {
    exposes_secrets: false,
    exposes_customer_information: false,
    exposes_private_evidence: false,
    exposes_commission_terms: false,
  },
} as const;

export function GET() {
  return NextResponse.json(PARTY_AT_RED_ROCKS_DCC_SITE_MANIFEST, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
