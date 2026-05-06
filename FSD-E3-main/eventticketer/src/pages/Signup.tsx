import { motion } from 'motion/react';
import { Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    password: ''
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new user object
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const newUser = { 
      name: fullName, 
      email: formData.email,
      institution: formData.institution,
      role: 'user' as const
    };

    // Update users list - Single source of truth
    const usersStr = localStorage.getItem('users');
    const existingUsers = usersStr ? JSON.parse(usersStr) : [];
    
    if (existingUsers.find((u: any) => u.email === newUser.email)) {
      alert("Email already exists!");
      return;
    }

    const updatedUsersList = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsersList));
    console.log("Users stored in localStorage 'users':", updatedUsersList);

    // Log in the new user
    localStorage.setItem('user', JSON.stringify(newUser));

    navigate('/');
  };

  return (
    <main className="max-w-[480px] w-full flex-1 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />
        
        <div className="mb-8 relative z-10">
          <h1 className="text-3xl font-serif text-white mb-2">Join Evently</h1>
          <p className="text-sm text-text-dim">Create an account to book and manage events.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600"
                  placeholder="Jane"
                />
              </div>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600"
                placeholder="jane.doe@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">Institution / Company</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600"
                placeholder="Innovation Block"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-stone-900/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-stone-600"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-stone-200 text-stone-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8 group"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-text-dim relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-accent transition-colors font-medium">Sign in</Link>
        </p>
      </motion.div>
    </main>
  );
}
