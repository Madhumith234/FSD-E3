import { Calendar, MapPin, Users, Ticket, Building2, Clock, Heart } from 'lucide-react';
import { EventDetails } from '../types';
import { motion } from 'motion/react';

interface EventCardProps {
  event: EventDetails;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function EventCard({ event, isFavorite, onToggleFavorite }: EventCardProps) {
  return (
    <div className="bg-surface rounded-xl p-12 border border-border h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
      {onToggleFavorite && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-6 right-6 p-2 rounded-full bg-bg/50 backdrop-blur-md border border-white/5 hover:border-accent/30 transition-all z-10 group"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/40 group-hover:text-white'}`} 
          />
        </button>
      )}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[12px] uppercase tracking-[0.2em] font-bold text-accent">
            {event.department}
          </span>
          <span className="bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-accent/20">
            {event.category}
          </span>
        </div>
        <h1 className="text-6xl font-serif text-white leading-[1.1] mb-6 font-normal">
          {event.name.split(':').map((part, i) => (
            <span key={i} className="block">
              {part}{i === 0 && event.name.includes(':') ? ':' : ''}
            </span>
          ))}
        </h1>
        <p className="text-text-dim max-w-md leading-relaxed text-sm mb-10">
          Join us for an exclusive technical symposium exploring the convergence of 
          innovation and research in modern technology.
        </p>
        
        <div className="flex items-baseline gap-4 mb-10">
          <span className="text-4xl font-serif text-accent leading-none">
            ${event.price.toFixed(2)}
          </span>
          <span className="text-sm text-text-dim">/ seat</span>
          <span className="ml-auto text-sm text-text-dim font-medium uppercase tracking-wider">
            {event.availableTickets} of {event.totalTickets} Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 pt-10 border-t border-border">
        <div className="detail-item">
          <label className="block text-[10px] uppercase text-text-dim tracking-[0.1em] mb-2 font-bold">
            Event Date & Time
          </label>
          <p className="text-lg text-text-main font-medium">{event.date} &bull; {event.time.split(' ')[0]}</p>
        </div>
        <div className="detail-item">
          <label className="block text-[10px] uppercase text-text-dim tracking-[0.1em] mb-2 font-bold">
            Venue
          </label>
          <p className="text-lg text-text-main font-medium">{event.venue}</p>
        </div>
      </div>
    </div>
  );
}
