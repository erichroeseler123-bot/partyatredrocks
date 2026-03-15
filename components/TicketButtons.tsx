type TicketButtonsProps = {
  event?: any;
};

export default function TicketButtons({ event }: TicketButtonsProps) {
  if (!event?.url) return null;
  return (
    <div className="flex gap-4 my-6">
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 pill text-white font-black rounded border border-soft hover:pill-soft transition"
      >
        Tickets
      </a>
    </div>
  );
}
