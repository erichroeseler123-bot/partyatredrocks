type TicketButtonsProps = {
  event?: any;
};

export default function TicketButtons({ event }: TicketButtonsProps) {
  return (
    <div className="flex gap-4 my-6">
      <a
        href={event?.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 transition"
      >
        Buy Tickets
      </a>
    </div>
  );
}
