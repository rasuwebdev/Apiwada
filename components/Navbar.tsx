
import React from 'react';
import { AppRoute, User } from '../types';
import { LOGO_SVG, LOGO_URL } from '../constants';
import { LogIn, UserCircle, Settings, LogOut, Image as ImageIcon } from 'lucide-react';

interface NavbarProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  logoUrl?: string; // Support for Admin1 custom logo
}

const Navbar: React.FC<NavbarProps> = ({ currentRoute, setRoute, currentUser, onLoginClick, onLogout, logoUrl }) => {
  const navItems = [
    { label: 'Home', route: AppRoute.Home },
    { label: 'Courses', route: AppRoute.Courses },
    { label: 'Gallery', route: AppRoute.Gallery },
    { label: 'About', route: AppRoute.About },
  ];

  const displayLogo = logoUrl || (LOGO_URL && !LOGO_URL.includes("placeholder") ? LOGO_URL : null);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRoute(AppRoute.Home)}>
            {displayLogo ? (
              <img src={displayLogo} alt="ApiWada Logo" className="w-10 h-10 object-contain" />
            ) : (
              <div className="text-blue-600">{LOGO_SVG}</div>
            )}
            <span className="text-xl font-black tracking-tight text-slate-800 hidden sm:block">
              APIWADA <span className="text-blue-600">PHYSICS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => setRoute(item.route)}
                className={`text-sm font-bold transition-colors ${
                  currentRoute === item.route ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === 'admin' && (
                  <button onClick={() => setRoute(AppRoute.Admin)} className="p-2 rounded-full hover:bg-slate-100 text-slate-600" title="Admin Panel">
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                <div className="group relative">
                  <button
                    onClick={() => setRoute(AppRoute.Profile)}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-all"
                  >
                    {currentUser.profilePic ? (
                      <img src={currentUser.profilePic} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <UserCircle className="w-5 h-5 text-blue-600" />
                    )}
                    <span className="text-sm font-bold text-slate-700">{currentUser.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right">
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
