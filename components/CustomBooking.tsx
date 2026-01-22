'use client';
import { useEffect, useState } from 'react';

export default function CustomBooking() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setSessionLoading(true);
      fetch(`/api/availability?productCode=${selectedProduct.productCode}`)
        .then(res => res.json()).then(setSessions).finally(() => setSessionLoading(false));
    }
  }, [selectedProduct]);

  if (loading) return <div className="text-white p-4">Loading services...</div>;

  return (
    <div className="space-y-6">
      {!selectedProduct ? (
        <div className="grid gap-4">
          <h3 className="text-xl font-bold text-white">1. Select Service</h3>
          {products.map((p: any) => (
            <button key={p.productCode} onClick={() => setSelectedProduct(p)} className="p-4 border border-white/20 bg-white/5 rounded-xl hover:bg-white/10 text-left">
              <div className="font-bold text-white">{p.name}</div>
              <div className="text-gray-400">${p.advertisedPrice}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedProduct(null)} className="text-blue-400 text-sm">← Back</button>
          <h3 className="text-xl font-bold text-white">2. Dates for {selectedProduct.name}</h3>
          {sessionLoading ? <div className="text-gray-400">Checking availability...</div> : (
            <div className="grid gap-2">
              {sessions.map((s: any) => (
                <button key={s.id} className="p-3 border border-white/10 bg-white/5 rounded-lg text-white hover:bg-blue-600 flex justify-between">
                  <span>{new Date(s.startTime).toLocaleDateString()}</span>
                  <span>{s.seatsAvailable} seats left</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
