import { motion, AnimatePresence } from 'motion/react';
import { Users, Ticket, TrendingUp, CalendarDays, MoreHorizontal, X, UserPlus, Shield, ShieldOff, Database, Trash2, Download, Upload, FileJson, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import React from 'react';
import { useEvents } from '../context/EventContext';

export default function Admin() {
  const { events, addEvent, bookings, deleteBooking, reviews, deleteReview, clearAllData, notifications } = useEvents();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'database'>('stats');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbCollection, setDbCollection] = useState<'bookings' | 'users' | 'reviews' | 'notifications'>('bookings');
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const usersStr = localStorage.getItem('users');
    const loadedUsers = usersStr ? JSON.parse(usersStr) : [];
    setUsers(loadedUsers);
    console.log("Users loaded in Admin Dashboard:", loadedUsers);

    const userStr = localStorage.getItem('user');
    setCurrentUser(userStr ? JSON.parse(userStr) : null);
  }, []);

  const [formData, setFormData] = useState({
    name: '', department: '', date: '', time: '', venue: '', price: 0, totalTickets: 0
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const ticketsSold = bookings.reduce((sum, b) => sum + b.ticketsBooked, 0);
  const totalEventTickets = events.reduce((sum, e) => sum + e.totalTickets, 0);

  const STATS = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, increase: '+12%' },
    { label: 'Tickets Sold', value: `${ticketsSold} / ${totalEventTickets || 500}`, icon: Ticket, increase: '+5%' },
    { label: 'Active Events', value: events.length.toString(), icon: CalendarDays, increase: '+1' },
    { label: 'Total Users', value: users.length.toString(), icon: Users, increase: `+${users.length}` },
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(formData);
    setIsModalOpen(false);
    setFormData({ name: '', department: '', date: '', time: '', venue: '', price: 0, totalTickets: 0 });
  };

  const toggleUserRole = (email: string) => {
    // Get fresh data from localStorage to avoid sync issues
    const usersStr = localStorage.getItem('users');
    const currentUsers = usersStr ? JSON.parse(usersStr) : [];

    const updatedUsers = currentUsers.map((u: any) => {
      if (u.email === email) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    });

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update local state to trigger re-render
    setUsers(updatedUsers);

    console.log("Updated Roles in localStorage:", updatedUsers);
  };

  return (
    <main className="max-w-[1024px] w-full flex-1 flex flex-col pt-4 pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white">Admin Dashboard</h1>
          <p className="text-sm text-text-dim">Manage your platform and community.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card/40 border border-white/5 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'stats' ? 'bg-white text-bg' : 'text-text-dim hover:text-white'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-white text-bg' : 'text-text-dim hover:text-white'}`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeTab === 'database' ? 'bg-white text-bg' : 'text-text-dim hover:text-white'}`}
            >
              Database
            </button>
          </div>
          {activeTab === 'stats' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent hover:bg-accent-highlight text-bg text-xs font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Event
            </button>
          )}
        </div>
      </div>

      {activeTab === 'stats' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card/40 border border-white/5 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-dim">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold ${stat.increase.startsWith('+') ? 'text-green-400' : 'text-stone-400'}`}>
                      {stat.increase}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                    <div className="text-xs text-text-dim uppercase tracking-wider font-semibold mt-1">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card/40 border border-white/5 rounded-xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Recent Transactions</h2>
              <button className="text-xs text-text-dim hover:text-white transition-colors uppercase tracking-widest font-bold">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 text-text-dim text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3 rounded-tl-xl">Booking ID</th>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Tickets</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 rounded-tr-xl"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-mono text-stone-300">{booking.id}</td>
                      <td className="px-5 py-4 text-white">
                        <div className="text-sm font-medium">{booking.userName}</div>
                        <div className="text-xs text-text-dim">{booking.userEmail}</div>
                      </td>
                      <td className="px-5 py-4 text-stone-300">{booking.ticketsBooked}</td>
                      <td className="px-5 py-4 text-white font-medium">${booking.totalAmount.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${booking.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                          {booking.status || 'Completed'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-stone-400 text-xs">{booking.date || 'Just Now'}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-stone-500 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      ) : activeTab === 'users' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/40 border border-white/5 rounded-xl overflow-hidden"
        >
          <div className="p-5 border-b border-white/5">
            <h2 className="text-lg font-medium text-white">Manage Platform Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-text-dim text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3 rounded-tl-xl">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3 text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                          {user.name[0]}
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-dim">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-white/5 text-text-dim border border-white/10'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {currentUser?.email !== user.email ? (
                        <button
                          onClick={() => toggleUserRole(user.email)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            }`}
                        >
                          {user.role === 'admin' ? (
                            <><ShieldOff className="w-3 h-3" /> Remove Admin</>
                          ) : (
                            <><Shield className="w-3 h-3" /> Make Admin</>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-text-dim font-bold uppercase italic opacity-50">Current User</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="bg-card/40 border border-white/5 rounded-lg p-1 flex">
              {(['bookings', 'users', 'reviews', 'notifications'] as const).map((col) => (
                <button
                  key={col}
                  onClick={() => setDbCollection(col)}
                  className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${dbCollection === col ? 'bg-accent text-bg' : 'text-text-dim hover:text-white'}`}
                >
                  {col}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const data = { bookings, users, reviews, notifications };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `evently-db-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export Data
              </button>
              <button
                onClick={() => {
                  if (confirm('ARE YOU SURE? This will permanently delete all local storage data including bookings, reviews, and notifications.')) {
                    clearAllData();
                  }
                }}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Purge Database
              </button>
            </div>
          </div>

          <div className="bg-card/40 border border-white/5 rounded-xl overflow-hidden min-h-[400px]">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Collection: {dbCollection}</h2>
                  <p className="text-[10px] text-text-dim">Viewing raw database records for the current platform state.</p>
                </div>
              </div>
              <div className="text-[10px] font-mono text-text-dim px-3 py-1 bg-white/5 rounded-full border border-white/5">
                {dbCollection === 'bookings' ? bookings.length :
                 dbCollection === 'users' ? users.length :
                 dbCollection === 'reviews' ? reviews.length :
                 notifications.length} RECORDS
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 text-text-dim text-[10px] uppercase tracking-widest font-bold">
                  {dbCollection === 'bookings' && (
                    <tr>
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Event</th>
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Tickets</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  )}
                  {dbCollection === 'users' && (
                    <tr>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  )}
                  {dbCollection === 'reviews' && (
                    <tr>
                      <th className="px-5 py-4">Event ID</th>
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Rating</th>
                      <th className="px-5 py-4">Comment</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  )}
                  {dbCollection === 'notifications' && (
                    <tr>
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Message</th>
                      <th className="px-5 py-4">Type</th>
                      <th className="px-5 py-4">Read</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dbCollection === 'bookings' && bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4 font-mono text-xs text-stone-400">{b.id}</td>
                      <td className="px-5 py-4 text-white font-medium">{b.eventName}</td>
                      <td className="px-5 py-4 text-text-dim">{b.userEmail}</td>
                      <td className="px-5 py-4 text-stone-300">{b.ticketsBooked}</td>
                      <td className="px-5 py-4 text-white font-bold">${b.totalAmount}</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => deleteBooking(b.id!)} className="text-red-500/40 hover:text-red-500 p-2 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dbCollection === 'users' && users.map((u) => (
                    <tr key={u.email} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4 text-white font-medium">{u.name}</td>
                      <td className="px-5 py-4 text-text-dim">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-text-dim">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => toggleUserRole(u.email)} className="text-accent/40 hover:text-accent p-2 transition-colors">
                          <FileJson className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dbCollection === 'reviews' && reviews.map((r, i) => (
                    <tr key={`${r.eventId}-${i}`} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4 text-stone-400 font-mono text-xs">{r.eventId}</td>
                      <td className="px-5 py-4 text-white font-medium">{r.userName}</td>
                      <td className="px-5 py-4 text-accent font-bold">★ {r.rating}</td>
                      <td className="px-5 py-4 text-text-dim max-w-[200px] truncate">{r.comment}</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => deleteReview(r.eventId, r.userEmail)} className="text-red-500/40 hover:text-red-500 p-2 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dbCollection === 'notifications' && notifications.map((n) => (
                    <tr key={n.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4 font-mono text-xs text-stone-400">{n.id}</td>
                      <td className="px-5 py-4 text-white max-w-[300px] truncate">{n.message}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${n.type === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                          {n.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-text-dim">{n.read ? 'Yes' : 'No'}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-stone-500/40 hover:text-stone-300 p-2 transition-colors">
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {((dbCollection === 'bookings' && bookings.length === 0) ||
                (dbCollection === 'users' && users.length === 0) ||
                (dbCollection === 'reviews' && reviews.length === 0) ||
                (dbCollection === 'notifications' && notifications.length === 0)) && (
                <div className="flex flex-col items-center justify-center py-20 text-text-dim opacity-50">
                  <Database className="w-12 h-12 mb-4 stroke-1" />
                  <p className="text-sm">This collection is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-[500px] rounded-2xl border border-white/10 p-6 relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-serif text-white mb-6">Create New Event</h2>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Event Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-stone-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent" placeholder="Annual Hackathon" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Department</label>
                  <input type="text" required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-stone-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent" placeholder="Computer Science" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Date</label>
                    <input type="text" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-stone-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent" placeholder="October 24, 2026" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Time</label>
                    <input type="text" required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full bg-stone-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent" placeholder="10:00 AM - 4:00 PM" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Venue</label>
                  <input type="text" required value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} className="w-full bg-stone-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent" placeholder="Main Auditorium" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Price ($)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-stone-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent" placeholder="25" min="0" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Total Tickets</label>
                    <input type="number" required value={formData.totalTickets} onChange={e => setFormData({ ...formData, totalTickets: Number(e.target.value) })} className="w-full bg-stone-900/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-accent" placeholder="250" min="1" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-accent hover:bg-accent-highlight text-bg font-bold py-3 mt-4 rounded-lg transition-colors">
                  Publish Event
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
