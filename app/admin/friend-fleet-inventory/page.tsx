import InventoryConsolePage from "@/app/admin/parr-inventory/InventoryConsolePage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function FriendFleetInventoryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <InventoryConsolePage
      searchParams={searchParams}
      defaultOwner="friend_fleet"
      basePath="/admin/friend-fleet-inventory"
      title="Friend Fleet Schedule"
      copy="Separate schedule page for overflow private inventory assigned to your friend’s Suburban and Sprinter."
    />
  );
}
