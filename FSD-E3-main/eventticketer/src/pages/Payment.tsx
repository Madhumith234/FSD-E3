import { motion } from 'motion/react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Booking } from '../types';
import { useEvents } from '../context/EventContext';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking, updateEventTickets, addNotification } = useEvents();
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingBooking: Booking | undefined = location.state?.pendingBooking;
  const eventName: string = location.state?.eventName || "Event";
  const eventId: string | undefined = location.state?.eventId;

  const tickets = pendingBooking?.ticketsBooked || 1;
  const baseAmount = pendingBooking?.totalAmount || 25;
  const processingFee = 2.50;
  const total = baseAmount + processingFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return; // Prevent double trigger
    
    setIsProcessing(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    setTimeout(() => {
      const bookingId = `BK-${Date.now().toString().slice(-6)}`;
      
      const finalizedBooking: Booking = {
        ...(pendingBooking || { ticketsBooked: 1, totalAmount: 25, userDepartment: 'N/A' }),
        id: bookingId,
        userName: user?.name || "Guest",
        userEmail: user?.email || "guest@example.com",
      };

      // Perform updates here instead of in EventPage's useEffect
      if (eventId) {
        updateEventTickets(eventId, finalizedBooking.ticketsBooked);
      }
      addBooking(finalizedBooking);
      addNotification(`Booking Confirmed: ${eventName}!`, 'success');

      setIsProcessing(false);
      navigate('/', { 
        state: { 
          successBooking: finalizedBooking, 
          eventName, 
          eventId 
        }, 
        replace: true 
      });
    }, 2000);
  };

  return (
    <main className="max-w-[800px] w-full flex-1 flex flex-col justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Order Summary */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-serif text-white mb-2">Checkout</h1>
            <p className="text-sm text-text-dim">Complete your booking securely.</p>
          </div>
          
          <div className="bg-stone-900/40 rounded-xl p-5 border border-white/5 space-y-4">
            <h3 className="text-white font-medium">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">{eventName} x {tickets}</span>
              <span className="text-white">${baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Processing Fee</span>
              <span className="text-white">${processingFee.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between font-bold">
              <span className="text-white">Total</span>
              <span className="text-accent">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-green-500/80" />
            <span>Payments are 256-bit encrypted and secure.</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="relative z-10 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">Cardholder Name</label>
            <input
              type="text"
              required
              className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600"
              placeholder="JANE DOE"
              defaultValue={pendingBooking?.userName || ''}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="text"
                required
                maxLength={19}
                className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600 font-mono"
                placeholder="0000 0000 0000 0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">Expiry (MM/YY)</label>
              <input
                type="text"
                required
                maxLength={5}
                className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600 font-mono"
                placeholder="12/26"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">CVC</label>
              <input
                type="text"
                required
                maxLength={3}
                className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600 font-mono"
                placeholder="123"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-accent hover:bg-accent-highlight text-bg font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 animate-pulse">
                <CreditCard className="w-4 h-4" /> Processing...
              </span>
            ) : (
              <span>Pay ${total.toFixed(2)}</span>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
