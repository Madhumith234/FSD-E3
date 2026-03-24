import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  LayoutDashboard, 
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Users,
  CalendarDays,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- TYPES ---
interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  price: number;
  available_tickets: number;
  description: string;
}

interface User {
  id: number;
  name: string;
  role: 'user' | 'admin';
}

interface Booking {
  id: number;
  event_name: string;
  date: string;
  location: string;
  tickets: number;
  booking_date: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'login' | 'register' | 'bookings' | 'admin'>('home');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const savedUser = localStorage.getItem('eventflow_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eventflow_user');
    setView('home');
    showMessage('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1C1C] font-sans selection:bg-emerald-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <Ticket size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">EventFlow</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setView('home')} className="text-sm font-medium hover:text-emerald-600 transition-colors">Events</button>
            {user ? (
              <>
                {user.role === 'user' && (
                  <button onClick={() => setView('bookings')} className="text-sm font-medium hover:text-emerald-600 transition-colors">My Bookings</button>
                )}
                {user.role === 'admin' && (
                  <button onClick={() => setView('admin')} className="text-sm font-medium hover:text-emerald-600 transition-colors flex items-center gap-1">
                    <ShieldCheck size={16} /> Admin
                  </button>
                )}
                <div className="h-4 w-px bg-black/10" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-emerald-700">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => setView('login')} className="text-sm font-medium hover:text-emerald-600">Login</button>
                <button 
                  onClick={() => setView('register')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? <ShieldCheck size={18} /> : <Users size={18} />}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === 'home' && <HomeView events={events} loading={loading} user={user} onBook={() => setView('bookings')} showMessage={showMessage} refreshEvents={fetchEvents} />}
        {view === 'login' && <LoginView onLogin={(u) => { setUser(u); setView('home'); }} onSwitch={() => setView('register')} showMessage={showMessage} />}
        {view === 'register' && <RegisterView onRegister={() => setView('login')} onSwitch={() => setView('login')} showMessage={showMessage} />}
        {view === 'bookings' && user && <BookingsView userId={user.id} />}
        {view === 'admin' && user?.role === 'admin' && <AdminView events={events} refreshEvents={fetchEvents} showMessage={showMessage} />}
      </main>
    </div>
  );
}

// --- SUB-VIEWS ---

function HomeView({ events, loading, user, onBook, showMessage, refreshEvents }: { events: Event[], loading: boolean, user: User | null, onBook: () => void, showMessage: (t: string, type?: any) => void, refreshEvents: () => void }) {
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState(1);

  const handleBooking = async () => {
    if (!user) {
      showMessage('Please login to book tickets', 'error');
      return;
    }
    if (!bookingEvent) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, eventId: bookingEvent.id, tickets })
      });
      const data = await res.json();
      if (data.success) {
        showMessage(`Successfully booked ${tickets} tickets!`);
        setBookingEvent(null);
        refreshEvents();
        onBook();
      } else {
        showMessage(data.error, 'error');
      }
    } catch (err) {
      showMessage('Booking failed', 'error');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-[#141414]">Discover <span className="text-emerald-600 italic font-serif">Experiences</span></h1>
        <p className="text-lg text-black/60 max-w-2xl">Browse upcoming events, from music festivals to tech conferences. Secure your spot in seconds.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <motion.div 
            key={event.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
          >
            <div className="h-48 bg-emerald-100 relative overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${event.id}/800/600`} 
                alt={event.name} 
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700 border border-emerald-100">
                ${event.price}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2">{event.name}</h3>
              <p className="text-sm text-black/50 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-black/70">
                  <CalendarDays size={16} className="text-emerald-500" />
                  <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-black/70">
                  <MapPin size={16} className="text-emerald-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-black/70">
                  <Ticket size={16} className="text-emerald-500" />
                  <span className={event.available_tickets < 10 ? 'text-red-500 font-semibold' : ''}>
                    {event.available_tickets} tickets left
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setBookingEvent(event)}
                disabled={event.available_tickets <= 0}
                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  event.available_tickets > 0 
                  ? 'bg-[#141414] text-white hover:bg-[#2A2A2A] active:scale-95' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {event.available_tickets > 0 ? (
                  <>Book Now <ChevronRight size={16} /></>
                ) : 'Sold Out'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingEvent && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingEvent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{bookingEvent.name}</h2>
                    <p className="text-black/50 text-sm">Confirm your booking</p>
                  </div>
                  <button onClick={() => setBookingEvent(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 flex items-center justify-between border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Price per ticket</p>
                      <p className="text-lg font-bold text-emerald-900">${bookingEvent.price}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-black/40 uppercase tracking-wider">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setTickets(Math.max(1, tickets - 1))}
                      className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center hover:bg-gray-50 active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-8 text-center">{tickets}</span>
                    <button 
                      onClick={() => setTickets(Math.min(bookingEvent.available_tickets, tickets + 1))}
                      className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center hover:bg-gray-50 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-black/50 font-medium">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-600">${(bookingEvent.price * tickets).toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleBooking}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoginView({ onLogin, onSwitch, showMessage }: { onLogin: (u: User) => void, onSwitch: () => void, showMessage: (t: string, type?: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('eventflow_user', JSON.stringify(data.user));
        onLogin(data.user);
        showMessage('Welcome back!');
      } else {
        showMessage(data.error, 'error');
      }
    } catch (err) {
      showMessage('Login failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
          <p className="text-black/50">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-[#141414] text-white py-4 rounded-2xl font-bold hover:bg-[#2A2A2A] transition-all shadow-lg active:scale-95">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-black/50">
          Don't have an account? <button onClick={onSwitch} className="text-emerald-600 font-bold hover:underline">Sign up</button>
        </p>
      </div>
    </div>
  );
}

function RegisterView({ onRegister, onSwitch, showMessage }: { onRegister: () => void, onSwitch: () => void, showMessage: (t: string, type?: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        showMessage('Registration successful! Please login.');
        onRegister();
      } else {
        showMessage(data.error, 'error');
      }
    } catch (err) {
      showMessage('Registration failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-10 rounded-[2.5rem] border border-black/5 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Create Account</h2>
          <p className="text-black/50">Join EventFlow today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Full Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95">
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-black/50">
          Already have an account? <button onClick={onSwitch} className="text-emerald-600 font-bold hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
}

function BookingsView({ userId }: { userId: number }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/my-bookings/${userId}`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-black tracking-tight">My Bookings</h2>
        <p className="text-black/50">Manage your upcoming event tickets</p>
      </header>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-black/5 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-xl font-bold text-black/40">No bookings yet</h3>
          <p className="text-black/30">Go explore some events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-3xl border border-black/5 flex items-center justify-between group hover:shadow-lg transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center text-emerald-600 border border-emerald-100">
                  <span className="text-xs font-bold uppercase">{new Date(booking.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                  <span className="text-xl font-black">{new Date(booking.date).getDate()}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold group-hover:text-emerald-600 transition-colors">{booking.event_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-black/40 mt-1">
                    <div className="flex items-center gap-1"><MapPin size={14} /> {booking.location}</div>
                    <div className="flex items-center gap-1"><Ticket size={14} /> {booking.tickets} Tickets</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-black/30 uppercase tracking-wider">Booked on</p>
                <p className="text-sm font-medium text-black/60">{new Date(booking.booking_date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminView({ events, refreshEvents, showMessage }: { events: Event[], refreshEvents: () => void, showMessage: (t: string, type?: any) => void }) {
  const [stats, setStats] = useState({ totalEvents: 0, totalBookings: 0, totalUsers: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    price: '',
    available_tickets: '',
    description: ''
  });

  useEffect(() => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats);
  }, [events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events';
    const method = editingEvent ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showMessage(editingEvent ? 'Event updated' : 'Event created');
        setShowForm(false);
        setEditingEvent(null);
        setFormData({ name: '', date: '', location: '', price: '', available_tickets: '', description: '' });
        refreshEvents();
      }
    } catch (err) {
      showMessage('Operation failed', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      showMessage('Event deleted');
      refreshEvents();
    } catch (err) {
      showMessage('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Admin Dashboard</h2>
          <p className="text-black/50">Overview of platform activity</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
        >
          <Plus size={20} /> New Event
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Events', value: stats.totalEvents, icon: CalendarDays, color: 'bg-blue-500' },
          { label: 'Total Bookings', value: stats.totalBookings, icon: Ticket, color: 'bg-emerald-500' },
          { label: 'Active Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-black/40 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-black/5 bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2"><LayoutDashboard size={18} /> Manage Events</h3>
          <span className="text-xs font-bold text-black/30 uppercase">{events.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-black/40 uppercase tracking-wider border-b border-black/5">
                <th className="px-8 py-4">Event Name</th>
                <th className="px-8 py-4">Date & Location</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold">{event.name}</td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</div>
                    <div className="text-xs text-black/40">{event.location}</div>
                  </td>
                  <td className="px-8 py-5 font-mono text-emerald-600 font-bold">${event.price}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${event.available_tickets < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {event.available_tickets}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingEvent(event);
                          setFormData({
                            name: event.name,
                            date: event.date,
                            location: event.location,
                            price: event.price.toString(),
                            available_tickets: event.available_tickets.toString(),
                            description: event.description
                          });
                          setShowForm(true);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowForm(false); setEditingEvent(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                    <p className="text-black/50 text-sm">Fill in the event details</p>
                  </div>
                  <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Event Name</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Date</label>
                    <input 
                      type="date" required value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Location</label>
                    <input 
                      type="text" required value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Price ($)</label>
                    <input 
                      type="number" required value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Available Tickets</label>
                    <input 
                      type="number" required value={formData.available_tickets}
                      onChange={(e) => setFormData({...formData, available_tickets: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-xs font-bold text-black/40 uppercase tracking-wider ml-1">Description</label>
                    <textarea 
                      required rows={3} value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-black/5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
