'use client';
import { useEffect, useState } from 'react';

export default function CustomBooking() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    quantity: 1 
  });

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
    setBookingLoading(true);
    const bookingPayload = {
      items: [{
        productCode: selectedProduct.productCode,
        startTimeLocal: selectedSession.startTimeLocal,
        quantities: [{ optionLabel: 'Adult', quantity: formData.quantity }]
      }],
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      }
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      
      if (res.ok) {
        alert('Booking Successful!');
        setSelectedProduct(null);
        setSelectedSession(null);
      } else {
        alert('Booking Failed. Check your Rezdy dashboard or try again.');
      }
    } catch (err) {
      alert('Error connecting to booking service.');
    } finally {
      setBookingLoading(false);
    }
  };

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
      ) : !selectedSession ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedProduct(null)} className="text-blue-400 text-sm">← Back</button>
          <h3 className="text-xl font-bold text-white">2. Pick a Date</h3>
          <div className="grid gap-2">
            {sessions.length > 0 ? sessions.map((s: any) => (
              <button key={s.id} onClick={() => setSelectedSession(s)} className="p-3 border border-white/10 bg-white/5 rounded-lg text-white hover:bg-blue-600 flex justify-between">
                <span>{new Date(s.startTime).toLocaleDateString()}</span>
                <span>{s.seatsAvailable} seats left</span>
              </button>
            )) : <p className="text-zinc-500 italic">No available dates found.</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedSession(null)} className="text-blue-400 text-sm">← Back</button>
          <h3 className="text-xl font-bold text-white">3. Passenger & Contact Info</h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-zinc-500 font-bold">Passengers</label>
            <select 
              className="w-full p-3 bg-zinc-900 border border-white/10 rounded text-white"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} Person{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="Last Name" className="p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input type="email" placeholder="Email" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="tel" placeholder="Phone" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, phone: e.target.value})} />
          
          <button 
            disabled={bookingLoading}
            onClick={handleBooking} 
            className={`w-full p-4 rounded-xl font-bold transition ${bookingLoading ? 'bg-zinc-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {bookingLoading ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      )}
    </div>
  );
}
