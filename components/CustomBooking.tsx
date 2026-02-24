'use client';
import { useEffect, useState } from 'react';

// Define the "venue" prop so TypeScript doesn't crash the build
export default function CustomBooking({ venue }: { venue?: string }) {
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
    // We pass the venue prop to the API to filter the products
    const url = venue ? `/api/products?venue=${venue}` : '/api/products';
    fetch(url)
      .then(res => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [venue]);

  useEffect(() => {
    if (selectedProduct) {
      fetch(`/api/availability?productCode=${selectedProduct.productCode}`)
        .then(res => res.json())
        .then(setSessions);
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
        alert('Booking Failed. Please check details and try again.');
      }
    } catch (err) {
      alert('Error connecting to booking service.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-muted text-sm">Loading services...</div>;

  return (
    <div className="space-y-6">
      {!selectedProduct ? (
        <div className="grid gap-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-tighter">1. Select Service</h3>
          {products.length > 0 ? products.map((p: any) => (
            <button key={p.productCode} onClick={() => setSelectedProduct(p)} className="p-4 border border-soft pill rounded-2xl hover:pill-soft text-left transition hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="font-bold text-white">{p.name}</div>
              <div className="text-red-600 text-sm font-mono">${p.advertisedPrice}</div>
            </button>
          )) : <p className="text-muted italic">No services available for this venue.</p>}
        </div>
      ) : !selectedSession ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedProduct(null)} className="text-muted text-xs uppercase font-black hover:text-white">← Back</button>
          <h3 className="text-lg font-bold text-white uppercase tracking-tighter">2. Pick a Date</h3>
          <div className="grid gap-2">
            {sessions.length > 0 ? sessions.map((s: any) => (
              <button key={s.id} onClick={() => setSelectedSession(s)} className="btn-primary">
                <span className="font-mono">{new Date(s.startTime).toLocaleDateString()}</span>
                <span className="text-[10px] pill-soft px-2 py-1 rounded-full uppercase">{s.seatsAvailable} Left</span>
              </button>
            )) : <p className="text-muted italic">No available dates found for this service.</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedSession(null)} className="text-muted text-xs uppercase font-black hover:text-white">← Back</button>
          <h3 className="text-lg font-bold text-white uppercase tracking-tighter">3. Finalize Booking</h3>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase text-muted font-black tracking-widest">Passengers</label>
            <select 
              className="w-full p-4 panel-soft rounded-2xl text-white focus:border-red-600 outline-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} Person{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="p-4 panel-soft rounded-2xl text-white outline-none focus:border-red-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="Last Name" className="p-4 panel-soft rounded-2xl text-white outline-none focus:border-red-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input type="email" placeholder="Email" className="w-full p-4 panel-soft rounded-2xl text-white outline-none focus:border-red-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="tel" placeholder="Phone" className="w-full p-4 panel-soft rounded-2xl text-white outline-none focus:border-red-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" onChange={e => setFormData({...formData, phone: e.target.value})} />
          
          <button 
            disabled={bookingLoading}
            onClick={handleBooking} 
            className={`w-full p-5 rounded-2xl font-black uppercase tracking-widest transition ${bookingLoading ? 'bg-zinc-800 text-muted' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'}`}
          >
            {bookingLoading ? 'Processing...' : 'Complete Reservation'}
          </button>
        </div>
      )}
    </div>
  );
}
