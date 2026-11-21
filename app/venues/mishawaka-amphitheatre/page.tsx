import Link from "next/link";

export const metadata = {
  title: "Mishawaka Private SUV Transportation — $499 | Party at Red Rocks",
  description: "Book a private SUV to Mishawaka Amphitheatre for up to 6 travelers. $499 per vehicle. Enter your concert, pickup and return details online.",
  alternates: { canonical: "https://www.partyatredrocks.com/venues/mishawaka-amphitheatre" },
};

const bookingHref = "https://gosnotransportation58.rezdy.com/790395/mishawaka-amphitheatre-private-suv";

export default function MishawakaPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 pb-14 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <section id="book" className="rounded-3xl border border-white/10 bg-[#0b1224] p-6 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8fd0ff]">Private concert transportation</p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">Your Mishawaka night.<br />Your own SUV.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">Ride to Mishawaka Amphitheatre with your own group of up to six travelers. Enter your concert, pickup address and return drop-off details when you book.</p>
          <p className="mt-8 text-5xl font-black">$499 <span className="mt-2 block text-base font-medium text-white/75">per private SUV · up to 6 travelers</span></p>
          <a href={bookingHref} className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-[#62f6ff] px-6 py-4 text-center font-black text-[#07111d] transition hover:bg-[#8cf8ff] sm:w-auto">Book your Mishawaka SUV →</a>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">Concert admission is separate. Review your trip details, applicable fees and cancellation terms in secure Rezdy checkout.</p>
        </section>
        <section className="mt-6 grid gap-5 md:grid-cols-3" aria-label="Booking details">
          {[
            ["One group, one vehicle", "The vehicle price covers your private group of up to six. Choose one vehicle when booking; this is not a per-seat shared shuttle."],
            ["Your show-night details", "Have your concert name, pickup address, return address and passenger count ready. Choose your preferred pickup date and time online."],
            ["Plan ahead", "Book at least three hours ahead. Allow extra travel time for Poudre Canyon traffic and weather, and confirm your pickup instructions before leaving."],
          ].map(([title, text]) => <article key={title} className="rounded-2xl border border-white/10 bg-[#0b1224] p-6"><h2 className="text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-white/75">{text}</p></article>)}
        </section>
        <nav className="mt-8 flex flex-wrap gap-6 text-[#8fd0ff]" aria-label="Related information"><Link href="/venues">All venues</Link></nav>
      </div>
    </main>
  );
}
