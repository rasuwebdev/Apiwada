
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-white text-xl font-bold">ApiWada Physics</h3>
          <p className="text-sm leading-relaxed">
            Elevating physics education for Sri Lankan students. We combine deep theoretical knowledge with practical exam-winning strategies.
          </p>
          <div className="flex space-x-4">
            <Facebook className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
            <Youtube className="w-5 h-5 hover:text-red-500 cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-pink-500 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>071 019 5000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>rasumotivation.contact@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Main St, Colombo, SL</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors">Exam Centers</li>
            <li className="hover:text-white cursor-pointer transition-colors">Student Success Stories</li>
            <li className="hover:text-white cursor-pointer transition-colors">Free Resources</li>
            <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} ApiWada Physics Education. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
