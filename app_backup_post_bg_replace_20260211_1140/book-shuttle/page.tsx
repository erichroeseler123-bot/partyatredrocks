export default function ShuttleBookingPage() {
  return (
    <main className="min-h-screen bg-surface text-white pt-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black mb-6">
          Red Rocks Shuttle
        </h1>
        <p className="text-zinc-400 mb-10">
          Shared shuttle service from Denver or Golden to Red Rocks Amphitheatre.
        </p>

        <script
          defer
          src="https://gosnotransportation58.rezdy.com/pluginJs"
        ></script>

        <iframe
          className="rezdy w-full"
          height="1000"
          frameBorder="0"
          src="https://gosnotransportation58.rezdy.com/catalog/638971/red-rocks-shuttle?iframe=true"
        ></iframe>
      </div>
    </main>
  );
}
