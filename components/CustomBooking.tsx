'use client';
import { useEffect, useState } from 'react';

export default function CustomBooking() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetch(`/api/availability?productCode=${selectedProduct.productCode}`)
        .then(res => res.json()).then(setSessions);
    }
  }, [selectedProduct]);

  const handleBooking = async () => {
    const bookingPayload = {
      items: [{
        productCode: selectedProduct.productCode,
        startTimeLocal: selectedSession.startTimeLocal,
        quantities: [{ optionLabel: 'Adult', quantity: 1 }]
      }],
      customer: formData
    };

    const res = await fetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingPayload)
    });
    
    if (res.ok) alert('Booking Successful!');
    else alert('Booking Failed. Please try again.');
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;

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
      ) : !selectedSession ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedProduct(null)} className="text-blue-400 text-sm">← Back</button>
          <h3 className="text-xl font-bold text-white">2. Pick a Date</h3>
          <div className="grid gap-2">
            {sessions.map((s: any) => (
              <button key={s.id} onClick={() => setSelectedSession(s)} className="p-3 border border-white/10 bg-white/5 rounded-lg text-white hover:bg-blue-600 flex justify-between">
                <span>{new Date(s.startTime).toLocaleDateString()}</span>
                <span>{s.seatsAvailable} left</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedSession(null)} className="text-blue-400 text-sm">← Back</button>
          <h3 className="text-xl font-bold text-white">3. Contact Details</h3>
          <input type="text" placeholder="First Name" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input type="text" placeholder="Last Name" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="tel" placeholder="Phone" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, phone: e.target.value})} />
          <button onClick={handleBooking} className="w-full bg-red-600 p-4 rounded-xl font-bold hover:bg-red-700 transition">Complete Booking</button>
        </div>
      )}
    </div>
  );
}
