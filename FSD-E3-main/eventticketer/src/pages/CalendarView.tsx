import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEvents } from '../context/EventContext';
import { motion, AnimatePresence } from 'motion/react';
import EventCard from '../components/EventCard';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight } from 'lucide-react';

export default function CalendarView() {
  const { events } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const eventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    events.forEach(event => {
      const date = new Date(event.date).toDateString();
      if (!map[date]) map[date] = [];
      map[date].push(event);
    });
    return map;
  }, [events]);

  const selectedDateEvents = useMemo(() => {
    return eventsByDate[selectedDate.toDateString()] || [];
  }, [selectedDate, eventsByDate]);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && eventsByDate[date.toDateString()]) {
      return 'has-event';
    }
    return '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 mt-8">
      {/* Calendar Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-2xl">
          <Calendar
            onChange={(val) => setSelectedDate(val as Date)}
            value={selectedDate}
            tileClassName={tileClassName}
            className="custom-calendar"
          />
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-accent mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Selected Date</span>
          </div>
          <h3 className="text-xl font-serif text-white">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <p className="text-sm text-text-dim mt-2">
            {selectedDateEvents.length} events scheduled for this day.
          </p>
        </div>
      </motion.div>

      {/* Events List for Selected Date */}
      <div className="space-y-8">
        <h2 className="text-2xl font-serif text-white mb-8 border-b border-border pb-4 flex items-center gap-3">
          Events on this day
          <ChevronRight className="w-5 h-5 text-accent" />
        </h2>

        <AnimatePresence mode="wait">
          {selectedDateEvents.length > 0 ? (
            <motion.div
              key={selectedDate.toDateString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="group cursor-pointer">
                  <EventCard event={event} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-surface/20 rounded-3xl border border-dashed border-border"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-text-dim" />
              </div>
              <p className="text-lg font-serif text-text-dim">No events scheduled for this date.</p>
              <p className="text-sm text-stone-600 mt-2">Try selecting a highlighted date on the calendar.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
