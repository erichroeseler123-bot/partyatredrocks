import TicketButtons from "@/components/TicketButtons";
import RezdyWidgets from "@/components/RezdyWidgets";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ShowPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <h1 className="text-4xl font-black mb-4">Event {id}</h1>

      <TicketButtons />
      <RezdyWidgets />
    </main>
  );
}

