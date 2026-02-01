
import React, { useState } from 'react';
import { registerUser, getUserByContact } from '../services/dbService';
import { User } from '../types';
import { X, UserPlus, Sparkles, Key, AlertCircle } from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    examYear: '2026',
    school: '',
    birthday: '',
    contact: ''
  });
  const [error, setError] = useState('');

  const validate = () => {
    // Contact: exactly 10 digits
    if (!/^\d{10}$/.test(formData.contact)) {
      return "Contact number must be exactly 10 digits (e.g., 0712345678).";
    }
    // Password: exactly 8 chars, including special char
    const specialChars = /[@#$%&]/;
    if (formData.password.length !== 8) {
      return "Password must be exactly 8 characters long.";
    }
    if (!specialChars.test(formData.password)) {
      return "Password must include at least one special character (@, #, $, %, &).";
    }
    // Check if contact already exists
    if (getUserByContact(formData.contact)) {
      return "This contact number is already registered.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const user = registerUser(formData);
    onSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-blue-600 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 hover:rotate-90 transition-transform">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Join ApiWada</h2>
          </div>
          <p className="text-blue-100 text-sm">Create your student account.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-start gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
            <input 
              required
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. Kasun Perera"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Set Password (8 chars + special char)</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                required
                type="password"
                maxLength={8}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-100 outline-none"
                placeholder="Ex: pass@123"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Exam Year</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border outline-none font-bold text-slate-700" 
                value={formData.examYear} 
                onChange={e => setFormData({...formData, examYear: e.target.value})}
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Birthday</label>
              <input type="date" required className="w-full p-3 bg-slate-50 rounded-xl border outline-none" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">School</label>
            <input required className="w-full p-3 bg-slate-50 rounded-xl border outline-none" placeholder="Your High School" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Number (10 digits)</label>
            <input 
              required 
              type="tel" 
              maxLength={10}
              className="w-full p-3 bg-slate-50 rounded-xl border outline-none" 
              placeholder="07XXXXXXXX" 
              value={formData.contact} 
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                setFormData({...formData, contact: val});
              }} 
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2">
            Create Account <Sparkles className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
