import { motion } from 'motion/react';
import { CheckCircle2, QrCode, Ticket, User, Building, Phone as PhoneIcon, Heart } from 'lucide-react';
import { Booking } from '../types';

interface BookingSummaryProps {
  booking: Booking;
  eventName: string;
  onClose: () => void;
}

export default function BookingSummary({ booking, eventName, onClose }: BookingSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-8 shadow-2xl border border-border max-w-sm w-full"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="bg-success/10 p-3 rounded-full text-success mb-4">
          <CheckCircle2 size={32} strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-serif text-white leading-none mb-2 font-normal">
          Reservation Confirmed
        </h2>
        <p className="text-text-dim text-xs tracking-wide uppercase">Your digital receipt is ready.</p>
      </div>

      <div className="bg-bg rounded-lg border border-border overflow-hidden mb-8">
        <div className="p-5 border-b border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[9px] uppercase font-bold text-text-dim tracking-[0.2em] mb-1">Event</p>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">{eventName}</h3>
            </div>
            <Ticket className="text-accent/30" size={24} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] uppercase font-bold text-text-dim tracking-[0.2em] mb-0.5">Attendee</p>
              <p className="text-xs text-text-main font-medium">{booking.userName}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-text-dim tracking-[0.2em] mb-0.5">Tickets</p>
              <p className="text-xs text-text-main font-medium">{booking.ticketsBooked}</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white/[0.02] flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase font-bold text-text-dim tracking-[0.2em] mb-0.5">Total Amount</p>
            <p className="text-xl font-serif text-accent tracking-tighter">${booking.totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white p-1 rounded-sm opacity-90">
            <QrCode size={36} className="text-bg" />
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-border text-white font-bold py-4 rounded-md hover:bg-stone-800 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
      >
        Close Receipt
      </button>
    </motion.div>
  );
}
