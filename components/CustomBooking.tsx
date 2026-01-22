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
<div className="space-y-4">
  <button onClick={() => setSelectedSession(null)} className="text-blue-400 text-sm">← Back</button>
  <h3 className="text-xl font-bold text-white">3. Booking Details</h3>
  
  {/* New Passenger Count Dropdown */}
  <div className="flex flex-col gap-2">
    <label className="text-xs uppercase text-zinc-500 font-bold">Number of Passengers</label>
    <select 
      className="w-full p-3 bg-white/5 border border-white/10 rounded text-white"
      onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
    >
      {[1,2,3,4,5,6,7,8].map(num => (
        <option key={num} value={num} className="bg-zinc-900">{num} Passenger{num > 1 ? 's' : ''}</option>
      ))}
    </select>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <input type="text" placeholder="First Name" className="p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, firstName: e.target.value})} />
    <input type="text" placeholder="Last Name" className="p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, lastName: e.target.value})} />
  </div>
  
  <input type="email" placeholder="Email" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, email: e.target.value})} />
  <input type="tel" placeholder="Phone" className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" onChange={e => setFormData({...formData, phone: e.target.value})} />
  
  <button onClick={handleBooking} className="w-full bg-red-600 p-4 rounded-xl font-bold hover:bg-red-700 transition">
    Book Now
  </button>
</div>
      )}
    </div>
  );
}
