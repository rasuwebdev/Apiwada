
import React, { useState } from 'react';
import { getUserByContact } from '../services/dbService';
import { User } from '../types';
import { X, Phone, Key, HelpCircle, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Triple Admin Check Logic
    const adminPasswords: Record<string, string> = {
      'ADMIN1': 'RasuMotivation@@@@',
      'ADMIN2': 'Admin123@NJ',
      'ADMIN3': 'Admin123@apiwada'
    };

    if (adminPasswords[contact] === password) {
      onSuccess({
        indexNumber: '000',
        name: `System Admin (${contact})`,
        examYear: 'N/A',
        school: 'ApiWada HQ',
        birthday: '1990-01-01',
        contact: contact,
        role: 'admin',
        activeCourses: [],
        // Fix: marks must be an array of Mark objects, not an empty object
        marks: [],
        watchTime: {}
      });
      return;
    } else if (adminPasswords[contact]) {
      setError('Invalid Administrator Password.');
      return;
    }

    const user = getUserByContact(contact);
    if (user) {
      if (user.password === password) {
        onSuccess(user);
      } else {
        setError('Incorrect password.');
      }
    } else {
      setError('Contact number or Admin ID not recognized.');
    }
  };

  if (showForgot) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center space-y-6 border border-slate-200">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
          <p className="text-slate-600">Please contact the <span className="font-bold">Administrator</span> or <span className="font-bold">Sir Niroshan Jayathunge</span> to reset your password.</p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase">Admin Contact</div>
            <div className="text-lg font-bold text-slate-800">071 019 5000</div>
          </div>
          <button 
            onClick={() => setShowForgot(false)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        <div className="bg-slate-900 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 hover:rotate-90 transition-transform">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Portal Login</h2>
          </div>
          <p className="text-slate-400 text-sm">Student & Admin Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact / Admin ID</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="07X XXX XXXX or ADMINX"
                value={contact}
                onChange={e => { setContact(e.target.value); setError(''); }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={() => setShowForgot(true)} className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] mt-4"
          >
            Login
          </button>
          
          <button 
            type="button"
            className="w-full text-blue-600 font-bold hover:underline text-sm"
            onClick={onClose}
          >
            New here? Register Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
