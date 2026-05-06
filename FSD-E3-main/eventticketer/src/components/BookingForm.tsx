import React, { useState } from 'react';
import { Mail, User, Building, Ticket as TicketIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../types';

interface BookingFormProps {
  availableTickets: number;
  ticketPrice: number;
  onBook: (booking: Booking) => void;
}

export default function BookingForm({ availableTickets, ticketPrice, onBook }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    tickets: '1'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    
    const ticketNum = parseInt(formData.tickets);
    if (isNaN(ticketNum) || ticketNum <= 0) {
      newErrors.tickets = 'Must be a positive number';
    } else if (ticketNum > availableTickets) {
      newErrors.tickets = `Only ${availableTickets} tickets available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const ticketsBooked = parseInt(formData.tickets);
      onBook({
        userName: formData.name,
        userEmail: formData.email,
        userDepartment: formData.department,
        ticketsBooked,
        totalAmount: ticketsBooked * ticketPrice
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      tickets: '1'
    });
    setErrors({});
  };

  return (
    <div className="bg-surface rounded-xl p-8 border border-border h-full flex flex-col shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-white leading-none mb-2 font-normal">
          Reserve Your Spot
        </h2>
        <p className="text-text-dim text-xs tracking-wide">Enter your credentials to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-1.5">
          <label className="text-[11px] text-text-dim uppercase tracking-wider font-semibold ml-0.5">Full Name</label>
          <input
            type="text"
            placeholder="Julian Sterling"
            className={`w-full bg-bg border ${errors.name ? 'border-error/50' : 'border-border'} rounded-md py-3 px-4 text-sm text-white placeholder:text-text-dim/30 focus:outline-none focus:border-accent transition-all`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="text-[10px] text-error font-medium mt-1 ml-0.5">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] text-text-dim uppercase tracking-wider font-semibold ml-0.5">Email Address</label>
          <input
            type="email"
            placeholder="j.sterling@university.edu"
            className={`w-full bg-bg border ${errors.email ? 'border-error/50' : 'border-border'} rounded-md py-3 px-4 text-sm text-white placeholder:text-text-dim/30 focus:outline-none focus:border-accent transition-all`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="text-[10px] text-error font-medium mt-1 ml-0.5">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] text-text-dim uppercase tracking-wider font-semibold ml-0.5">Department</label>
            <input
              type="text"
              placeholder="Engineering"
              className={`w-full bg-bg border ${errors.department ? 'border-error/50' : 'border-border'} rounded-md py-3 px-4 text-sm text-white placeholder:text-text-dim/30 focus:outline-none focus:border-accent transition-all`}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-text-dim uppercase tracking-wider font-semibold ml-0.5">Tickets</label>
            <input
              type="number"
              min="1"
              max={availableTickets}
              className={`w-full bg-bg border ${errors.tickets ? 'border-error/50' : 'border-border'} rounded-md py-3 px-4 text-sm text-white focus:outline-none focus:border-accent transition-all`}
              value={formData.tickets}
              onChange={(e) => setFormData({ ...formData, tickets: e.target.value })}
            />
          </div>
        </div>

        {errors.tickets && <p className="text-[10px] text-error font-medium mt-1 ml-0.5">{errors.tickets}</p>}

        {/* Real-time Summary preview in Dark style */}
        {!isZero(formData.tickets) && validateFormSilent(formData, availableTickets) && (
           <div className="bg-success/5 border border-success/20 rounded-lg p-4 mt-auto mb-4">
              <div className="flex items-center gap-2 text-success text-[11px] font-bold uppercase tracking-widest mb-3">
                <CheckCircle2 size={12} strokeWidth={3} />
                Ready to Confirm
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-dim italic">Quantity</span>
                  <span className="text-text-main font-medium">{formData.tickets} Tickets</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-white/5 font-bold">
                  <span className="text-text-dim italic">Total Amount</span>
                  <span className="text-accent tracking-tighter text-sm">${(parseInt(formData.tickets) * ticketPrice).toFixed(2)}</span>
                </div>
              </div>
           </div>
        )}

        <div className="flex gap-2 pt-4 mt-auto">
          <button
            type="submit"
            disabled={availableTickets === 0}
            className="flex-1 bg-accent text-bg font-bold py-4 rounded-md hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale uppercase tracking-widest text-xs"
          >
            {availableTickets === 0 ? 'Waitlist Only' : 'Book Ticket'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 bg-bg text-text-dim font-bold py-4 rounded-md border border-border hover:text-white hover:border-text-dim transition-all text-[10px] uppercase tracking-widest"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper for real-time validation without state updates during render
function validateFormSilent(data: any, available: number) {
  const t = parseInt(data.tickets);
  return data.name.trim() && data.email.trim() && data.department.trim() && !isNaN(t) && t > 0 && t <= available;
}

function isZero(val: string) {
  return val === '' || parseInt(val) <= 0;
}
