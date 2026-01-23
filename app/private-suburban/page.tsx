export default function PrivateSuburbanPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-black mb-6">
          Private Suburban
        </h1>
        <p className="text-zinc-400 mb-10">
          Flat-rate private SUV service to Red Rocks. No sharing. No waiting.
        </p>

        <script
          defer
          src="https://gosnotransportation58.rezdy.com/pluginJs"
        ></script>

        <iframe
          className="rezdy w-full"
          height="1000"
          frameBorder="0"
          src="https://gosnotransportation58.rezdy.com/596193/suburban?iframe=true"
        ></iframe>
      </div>
    </main>
  );
}
