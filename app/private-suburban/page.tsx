export default function PrivateSuburbanPage() {
  return (
    <main className="comic-page pt-24 pb-10">
      <section className="comic-wrap">
        <div className="comic-hero">
          <p className="comic-kicker">Private SUV Service</p>
          <h1 className="comic-title">Private Suburban</h1>

          <p className="comic-copy">
            Door-to-door roundtrip service. Your schedule, your group, your soundtrack.
          </p>

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href="#book" className="comic-btn comic-btn-primary">
              Book Private Suburban
            </a>
            <a href="/find" className="comic-btn comic-btn-secondary">
              Compare All Rides
            </a>
          </div>
        </div>

        <div className="comic-grid">
          <div className="comic-panel">
            <div className="comic-tag">Capacity</div>
            <div className="comic-h3">Up to 6 Guests</div>
            <p className="comic-copy">Great for couples nights, family trips, and small friend groups.</p>
          </div>
          <div className="comic-panel">
            <div className="comic-tag">Pickup Style</div>
            <div className="comic-h3">Door to Door</div>
            <p className="comic-copy">No post-show surge hunting. Your return ride is part of the plan.</p>
          </div>
        </div>
      </section>

      <section id="book" className="comic-wrap" style={{ marginTop: 14 }}>
        <div className="comic-panel">
          <div className="comic-tag">Checkout</div>
          <h2 className="comic-h3">Reserve Your Date</h2>
          <p className="comic-copy">Pricing and live availability are managed by Rezdy.</p>

          <div style={{ marginTop: 12 }}>
            <script defer type="text/javascript" src="https://gosnotransportation58.rezdy.com/pluginJs"></script>

            <iframe
              seamless
              width="100%"
              height="1000px"
              frameBorder="0"
              className="rezdy rounded-[1rem] bg-surface border border-white/20"
              src="https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
