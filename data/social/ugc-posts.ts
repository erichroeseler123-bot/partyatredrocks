import { getSocialProofImage } from "@/data/media";

export type UGCPost = {
  id: string;
  platform: "instagram" | "facebook" | "x";
  postUrl: string;
  imageUrl: string;
  caption: string;
  username: string;
  postedAt: string;
  brandKey: "partyatredrocks";
  status: "approved" | "hidden";
  featured?: boolean;
};

export const parrUGCPosts: UGCPost[] = [
  {
    id: "parr-night-arrival",
    platform: "instagram",
    postUrl: "https://www.instagram.com/partyatredrocks",
    imageUrl: getSocialProofImage("parr-night-arrival").imageUrl,
    caption: "Ride-night arrivals dialed in before gates, with the group already synced on pickup and return.",
    username: "@partyatredrocks",
    postedAt: "2026-03-20",
    brandKey: "partyatredrocks",
    status: "approved",
    featured: true,
  },
  {
    id: "parr-night-crowd",
    platform: "instagram",
    postUrl: "https://www.instagram.com/partyatredrocks",
    imageUrl: getSocialProofImage("parr-night-crowd").imageUrl,
    caption: "Venue energy before showtime, built around a plan that already covers the ride home.",
    username: "@partyatredrocks",
    postedAt: "2026-03-18",
    brandKey: "partyatredrocks",
    status: "approved",
    featured: true,
  },
  {
    id: "parr-night-suv",
    platform: "facebook",
    postUrl: "https://www.facebook.com/redrockstransportation/",
    imageUrl: getSocialProofImage("parr-night-suv").imageUrl,
    caption: "Private SUV nights for smaller groups who want tighter timing and one clean vehicle plan.",
    username: "Red Rocks Transportation",
    postedAt: "2026-03-16",
    brandKey: "partyatredrocks",
    status: "approved",
  },
  {
    id: "parr-night-group",
    platform: "x",
    postUrl: "https://x.com/partyatredrocks",
    imageUrl: getSocialProofImage("parr-night-group").imageUrl,
    caption: "Group arrival and post-show fleet flow that keeps everyone on one plan instead of split pickups.",
    username: "@partyatredrocks",
    postedAt: "2026-03-14",
    brandKey: "partyatredrocks",
    status: "approved",
  },
];

export function getApprovedUGCPosts(brandKey: UGCPost["brandKey"]) {
  return parrUGCPosts.filter((post) => post.brandKey === brandKey && post.status === "approved");
}

export function getFeaturedUGCPosts(brandKey: UGCPost["brandKey"], limit = 3) {
  const approved = getApprovedUGCPosts(brandKey);
  const featured = approved.filter((post) => post.featured);
  const fallback = approved.filter((post) => !post.featured);
  return [...featured, ...fallback].slice(0, limit);
}
