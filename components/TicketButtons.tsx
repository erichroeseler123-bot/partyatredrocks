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
        className="px-6 py-3 bg-white/5 text-white font-black rounded border border-white/10 hover:bg-white/10 transition"
      >
        Buy Tickets
      </a>
    </div>
  );
}
