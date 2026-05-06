import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EventDetails, Booking } from '../types';
import EventCard from '../components/EventCard';
import BookingForm from '../components/BookingForm';
import BookingSummary from '../components/BookingSummary';
import ReviewSection from '../components/ReviewSection';
import CalendarView from './CalendarView';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Search, SlidersHorizontal, X, ChevronDown, Check, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';

export default function EventPage() {
  const { events, updateEventTickets, addBooking } = useEvents();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [isShowingSummary, setIsShowingSummary] = useState(false);
  const [summaryEventName, setSummaryEventName] = useState("");
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCat, setSelectedCat] = useState("All");
  const [sortBy, setSortBy] = useState("date"); // "date" or "price"

  // Favorites State
  const [favorites, setFavorites] = useState<{ eventId: string; userEmail: string }[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const toggleFavorite = (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFavorites(prev => {
      const exists = prev.find(f => f.eventId === eventId && f.userEmail === user.email);
      let updated;
      if (exists) {
        updated = prev.filter(f => !(f.eventId === eventId && f.userEmail === user.email));
      } else {
        updated = [...prev, { eventId, userEmail: user.email }];
      }
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Result State (Manual update)
  const [filteredEvents, setFilteredEvents] = useState<EventDetails[]>(events);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successBooking) {
      const booking = location.state.successBooking;
      setCurrentBooking(booking);
      setSummaryEventName(location.state.eventName || "Event");
      setIsShowingSummary(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Sync initial state when events are loaded or modified
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const departments = useMemo(() => ["All", ...new Set(events.map(e => e.department))], [events]);
  const categories = useMemo(() => ["All", ...new Set(events.map(e => e.category))], [events]);

  const applyFilters = () => {
    let updated = [...events]
      .filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(event => 
        selectedDept === "All" || event.department === selectedDept
      )
      .filter(event => 
        selectedCat === "All" || event.category === selectedCat
      );

    if (sortBy === "price") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortBy === "date") {
      updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    setFilteredEvents(updated);
  };

  const handleBooking = (booking: Booking, event: EventDetails) => {
    navigate('/payment', { state: { pendingBooking: booking, eventName: event.name, eventId: event.id } });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDept("All");
    setSelectedCat("All");
    setSortBy("date");
    setFilteredEvents(events);
  };

  return (
    <>
      <main className="max-w-[1024px] w-full flex flex-col gap-8">
        {/* View Toggle & Search Row */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-serif text-white italic">Featured Events</h1>
            
            <div className="flex bg-surface p-1 rounded-xl border border-border shadow-inner">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-accent text-bg' : 'text-text-dim hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                List View
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-accent text-bg' : 'text-text-dim hover:text-white'}`}
              >
                <CalendarIcon className="w-4 h-4" />
                Calendar
              </button>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-accent transition-colors" />
            <input 
              type="text"
              placeholder="Search for events by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-text-dim mr-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
            </div>

            <div className="relative">
              <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="appearance-none bg-surface border border-border rounded-xl px-4 py-2 pr-10 text-xs text-white focus:outline-none focus:border-accent/30 cursor-pointer">
                {departments.map(d => <option key={d} value={d} className="bg-stone-900">{d === "All" ? "All Departments" : d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-dim pointer-events-none" />
            </div>

            <div className="relative">
              <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="appearance-none bg-surface border border-border rounded-xl px-4 py-2 pr-10 text-xs text-white focus:outline-none focus:border-accent/30 cursor-pointer">
                {categories.map(c => <option key={c} value={c} className="bg-stone-900">{c === "All" ? "All Categories" : c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-dim pointer-events-none" />
            </div>

            <div className="relative ml-auto sm:ml-0">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-surface border border-border rounded-xl px-4 py-2 pr-10 text-xs text-white focus:outline-none focus:border-accent/30 cursor-pointer">
                <option value="date" className="bg-stone-900">Sort by: Date</option>
                <option value="price" className="bg-stone-900">Sort by: Price</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-dim pointer-events-none" />
            </div>

            <button onClick={applyFilters} className="bg-accent hover:bg-accent-highlight text-bg text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
              <Check className="w-3 h-3" />
              Apply
            </button>

            {(searchQuery || selectedDept !== "All" || selectedCat !== "All") && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider hover:text-red-300 transition-colors px-2 py-1">
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </section>

        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list" 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-16"
            >
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 pb-16 border-b border-border last:border-0">
                  <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <EventCard 
                      event={event} 
                      isFavorite={favorites.some(f => f.eventId === event.id && f.userEmail === user?.email)}
                      onToggleFavorite={() => toggleFavorite(event.id)}
                    />
                    <ReviewSection eventId={event.id} />
                  </motion.section>
                  <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <BookingForm availableTickets={event.availableTickets} ticketPrice={event.price} onBook={(booking) => handleBooking(booking, event)} />
                  </motion.section>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <div className="text-center py-32 text-text-dim border border-dashed border-border rounded-3xl">
                  <p className="text-lg font-serif">No events found.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CalendarView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isShowingSummary && currentBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/60 backdrop-blur-md">
            <BookingSummary booking={currentBooking} eventName={summaryEventName} onClose={() => setIsShowingSummary(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
