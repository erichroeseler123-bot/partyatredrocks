function toQuery(src) {
  return typeof src === "string" ? src : "red rocks amphitheatre concert night denver";
}

module.exports = function unsplashLoader({ src, width, quality }) {
  if (typeof src === "string" && src.startsWith("/api/unsplash-image?")) {
    return src;
  }

  const params = new URLSearchParams();
  params.set("q", toQuery(src));
  params.set("src", typeof src === "string" ? src : "");
  params.set("w", String(width || 1600));
  if (quality) params.set("qf", String(quality));
  return `/api/unsplash-image?${params.toString()}`;
};
