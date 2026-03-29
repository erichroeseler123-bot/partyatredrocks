'use client';
import { useState, useEffect } from 'react';

export default function BookingTerminal({ productType }: { productType: 'shared' | 'private' }) {
  const [inventory, setInventory] = useState<number | null>(null);

  // Placeholder for a future real-time inventory sync
  useEffect(() => {
    async function syncInventory() {
      // Logic to fetch availability for product IDs (Shared: $1 / Private: $499)
    }
    syncInventory();
  }, [productType]);

  return (
    <div className="font-mono uppercase">
      {inventory !== null ? (
        <p className="text-emerald-400 animate-pulse text-[10px] font-bold">
          Nodes_Available: {inventory}
        </p>
      ) : (
        <p className="text-blue-500 text-[10px] font-bold">Syncing_Inventory_Feed...</p>
      )}
    </div>
  );
}
