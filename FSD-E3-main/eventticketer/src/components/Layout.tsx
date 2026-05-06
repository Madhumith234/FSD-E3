import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import Chatbot from './Chatbot';

export default function Layout() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <header className="max-w-[1024px] w-full mb-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
            <span className="text-bg font-black">E</span>
          </div>
          <span className="font-serif text-xl tracking-tight text-white italic">
            Evently
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <NotificationBell />
          <ThemeToggle />
          {!user ? (
            <>
              <Link to="/login" className="text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] hover:text-white transition-colors">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] hover:text-white transition-colors">
                <User className="w-3 h-3" />
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] hover:text-white transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] hover:text-white transition-colors">
              Admin
            </Link>
          )}
        </div>
      </header>

      <Outlet />

      <footer className="mt-24 text-stone-400 text-xs font-medium uppercase tracking-[0.2em]">
        &copy; 2026 Innovation Block &bull; Built with Passion
      </footer>

      <Chatbot />
    </div>
  );
}
