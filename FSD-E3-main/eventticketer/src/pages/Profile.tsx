import { useEvents } from '../context/EventContext';
import { motion } from 'motion/react';
import { User, Mail, Ticket, Download, QrCode, Heart, Camera } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { useState } from 'react';
import EventCard from '../components/EventCard';

export default function Profile() {
  const { bookings, events } = useEvents();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<{ eventId: string; userEmail: string }[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const userBookings = bookings
    .filter(b => b.userEmail === user?.email)
    .filter((booking, index, self) => 
      index === self.findIndex((b) => b.id === booking.id)
    );

  const favoritedEvents = events.filter(event => 
    favorites.some(f => f.eventId === event.id && f.userEmail === user?.email)
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, avatar: reader.result as string };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Also update the users list for consistency
      const usersStr = localStorage.getItem('users');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const updatedUsers = users.map((u: any) => u.email === user.email ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleFavorite = (eventId: string) => {
    const updated = favorites.filter(f => !(f.eventId === eventId && f.userEmail === user?.email));
    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  const downloadTicket = (booking: any) => {
    const doc = new jsPDF();
    doc.setFillColor(24, 24, 27);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setDrawColor(161, 161, 170);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 80);
    doc.setTextColor(255, 255, 255);
    doc.setFont('serif', 'bold');
    doc.setFontSize(24);
    doc.text(booking.eventName || 'Event Ticket', 20, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(212, 212, 216);
    doc.text(`Attendee: ${booking.userName}`, 20, 45);
    doc.text(`Email: ${booking.userEmail}`, 20, 52);
    doc.text(`Booking ID: ${booking.id}`, 20, 59);
    doc.text(`Tickets: ${booking.ticketsBooked}`, 20, 66);
    doc.text(`Status: ${booking.status}`, 20, 73);
    const canvas = document.getElementById(`qr-${booking.id}`) as HTMLCanvasElement;
    if (canvas) {
      const qrImage = canvas.toDataURL('image/png');
      doc.addImage(qrImage, 'PNG', 150, 20, 40, 40);
    }
    doc.save(`Ticket-${booking.id}.pdf`);
  };

  return (
    <main className="max-w-[1024px] w-full flex-1 flex flex-col pt-8 pb-12">
      {/* User Info Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
      >
        <div className="relative group">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-2 border-accent" />
          ) : (
            <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-bg text-4xl font-serif">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
            <Camera className="w-6 h-6 text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-serif text-text-main flex items-center justify-center md:justify-start gap-3">
            <User className="w-6 h-6 text-accent" />
            {user?.name}
          </h1>
          <p className="text-text-dim flex items-center justify-center md:justify-start gap-2 mt-1">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-12">
        {/* Bookings List */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-text-main flex items-center gap-3 mb-6">
            <Ticket className="w-6 h-6 text-accent" />
            My Bookings ({userBookings.length})
          </h2>

          {userBookings.length === 0 ? (
            <div className="text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-border">
              <p className="text-text-dim">You haven't booked any events yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-serif text-text-main">{booking.eventName}</h3>
                      <p className="text-xs text-text-dim mt-1">ID: {booking.id}</p>
                    </div>
                    <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded border border-success/20">
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-xs">
                      <p className="text-text-dim uppercase tracking-wider font-bold mb-1">Tickets</p>
                      <p className="text-text-main">{booking.ticketsBooked}</p>
                    </div>
                    <div className="text-xs">
                      <p className="text-text-dim uppercase tracking-wider font-bold mb-1">Date</p>
                      <p className="text-text-main">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => downloadTicket(booking)}
                      className="flex-1 bg-text-main hover:bg-stone-400 text-bg text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button 
                      onClick={() => setSelectedQR(selectedQR === booking.id ? null : booking.id)}
                      className="w-12 h-12 bg-white/5 hover:bg-white/10 text-text-main rounded-lg flex items-center justify-center transition-colors border border-border"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="hidden">
                    <QRCodeCanvas id={`qr-${booking.id}`} value={`${booking.id}-${booking.eventName}`} size={256} level="H" />
                  </div>

                  {selectedQR === booking.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 flex flex-col items-center p-4 bg-white rounded-lg">
                      <QRCodeCanvas value={`${booking.id}-${booking.eventName}`} size={160} />
                      <p className="text-[10px] text-bg font-bold mt-2 uppercase tracking-tighter">Scan at Venue</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Favorites List */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-text-main flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            My Wishlist ({favoritedEvents.length})
          </h2>

          {favoritedEvents.length === 0 ? (
            <div className="text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-border">
              <p className="text-text-dim">Your wishlist is empty.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {favoritedEvents.map((event, index) => (
                <div key={event.id} className="pb-8 border-b border-border last:border-0">
                  <EventCard 
                    event={event} 
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(event.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
