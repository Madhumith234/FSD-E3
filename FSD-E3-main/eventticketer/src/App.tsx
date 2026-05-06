import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import EventPage from './pages/EventPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Simple placeholder components for now, will replace with real ones later.
import Login from './pages/Login';
import Signup from './pages/Signup';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

export default function App() {
  useEffect(() => {
    // Initialize default admin if no users exist or list is empty
    const usersStr = localStorage.getItem('users');
    const existingUsers = usersStr ? JSON.parse(usersStr) : [];
    
    if (existingUsers.length === 0) {
      const defaultAdmin = {
        name: "Admin",
        email: "admin@evently.com",
        role: "admin"
      };
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
      console.log("Default admin initialized.");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<EventPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="payment" element={<Payment />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  );
}
