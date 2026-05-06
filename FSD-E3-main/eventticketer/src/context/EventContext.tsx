import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { EventDetails, Booking } from '../types';

export interface Review {
  eventId: string;
  userEmail: string;
  rating: number;
  comment: string;
  userName: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: number;
  type: 'success' | 'info' | 'warning';
}

interface EventContextType {
  events: EventDetails[];
  addEvent: (event: Omit<EventDetails, 'id' | 'availableTickets'>) => void;
  updateEventTickets: (eventId: string, ticketCount: number) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (eventId: string, userEmail: string) => void;
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  clearAllData: () => void;
}

const INITIAL_EVENTS: EventDetails[] = [
  {
    id: 'ev-112',
    name: 'Global Tech Seminar 2026',
    department: 'CSE',
    date: 'October 24, 2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Main Auditorium, Innovation Block',
    price: 25,
    totalTickets: 250,
    availableTickets: 184,
    category: 'Seminar'
  },
  {
    id: 'ev-113',
    name: 'Rock Night Live',
    department: 'Music Club',
    date: 'November 15, 2026',
    time: '06:00 PM - 10:00 PM',
    venue: 'Open Air Theater',
    price: 15,
    totalTickets: 500,
    availableTickets: 320,
    category: 'Music'
  },
  {
    id: 'ev-114',
    name: 'React Mastery Workshop',
    department: 'CSE',
    date: 'October 10, 2026',
    time: '09:00 AM - 01:00 PM',
    venue: 'Lab 4, Tech Block',
    price: 50,
    totalTickets: 50,
    availableTickets: 12,
    category: 'Workshop'
  },
  {
    id: 'ev-115',
    name: 'AutoCAD Design Expo',
    department: 'MECH',
    date: 'December 05, 2026',
    time: '11:00 AM - 03:00 PM',
    venue: 'Workshop Gallery',
    price: 10,
    totalTickets: 200,
    availableTickets: 145,
    category: 'Workshop'
  }
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventDetails[]>(INITIAL_EVENTS);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bookings');
    return saved ? JSON.parse(saved) : [];
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('reviews');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Check for reminders on app load
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const user = JSON.parse(userStr);

    const userBookings = bookings.filter(b => b.userEmail === user.email);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    userBookings.forEach(booking => {
      const event = events.find(e => e.name === booking.eventName);
      if (event && event.date === tomorrowStr) {
        const reminderId = `REM-${event.id}`;
        if (!notifications.some(n => n.id === reminderId)) {
          addNotification(`Reminder: ${event.name} is tomorrow!`, 'warning');
        }
      }
    });
  }, []);

  const addEvent = useCallback((newEvent: Omit<EventDetails, 'id' | 'availableTickets'>) => {
    const event: EventDetails = {
      ...newEvent,
      id: `ev-${Math.floor(Math.random() * 10000)}`,
      availableTickets: newEvent.totalTickets
    };
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEventTickets = useCallback((eventId: string, ticketsBooked: number) => {
    setEvents(prev => 
      prev.map(evt => 
        evt.id === eventId 
          ? { ...evt, availableTickets: Math.max(0, evt.availableTickets - ticketsBooked) }
          : evt
      )
    );
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setBookings(prev => {
      const exists = prev.some(b => b.id === booking.id);
      if (exists) return prev;

      const newBooking = {
        ...booking,
        id: booking.id || `BK-${Date.now().toString().slice(-6)}`,
        status: 'Completed',
        date: booking.date || new Date().toLocaleDateString()
      };
      
      return [newBooking, ...prev];
    });
  }, []);

  const deleteBooking = useCallback((id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  const addReview = useCallback((review: Review) => {
    setReviews(prev => [review, ...prev]);
  }, []);

  const deleteReview = useCallback((eventId: string, userEmail: string) => {
    setReviews(prev => prev.filter(r => !(r.eventId === eventId && r.userEmail === userEmail)));
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type'] = 'info') => {
    const newNotification: Notification = {
      id: `NT-${Date.now()}`,
      message,
      type,
      read: false,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearAllData = useCallback(() => {
    setBookings([]);
    setReviews([]);
    setNotifications([]);
    localStorage.removeItem('bookings');
    localStorage.removeItem('reviews');
    localStorage.removeItem('notifications');
    // We don't clear 'users' here as it's managed separately in App.tsx/Admin.tsx
    // but we could if we wanted a full reset.
  }, []);

  return (
    <EventContext.Provider value={{ 
      events, addEvent, updateEventTickets, 
      bookings, addBooking, deleteBooking,
      reviews, addReview, deleteReview,
      notifications, addNotification, markAsRead, clearNotifications,
      clearAllData
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
