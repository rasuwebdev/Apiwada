
import React from 'react';
import { ArrowRight, PlayCircle, Trophy } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
  settings: SiteSettings;
}

const Hero: React.FC<HeroProps> = ({ onRegisterClick, onExploreClick, settings }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-20 px-4">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-blue-500 animate-pulse" />
          <path d="M0,40 Q25,60 50,40 T100,40" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-purple-500 animate-pulse" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto text-center space-y-8 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-2 rounded-full text-sm font-black border border-blue-100 mb-4 animate-bounce">
          <Trophy className="w-4 h-4" />
          {settings.heroBadge || 'The best physics class in Srilanka'}
        </div>

        {/* Tutor Image Section */}
        {settings.heroTutorImage && (
          <div className="relative mb-6 animate-in fade-in zoom-in duration-1000">
             <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full scale-125 -z-10"></div>
             <img 
               src={settings.heroTutorImage} 
               alt="Tutor Niroshan" 
               className="w-48 md:w-64 h-auto drop-shadow-[0_20px_50px_rgba(59,130,246,0.5)] transform hover:scale-105 transition-transform duration-500"
             />
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {settings.heroTitle ? (
             <>
               {settings.heroTitle.split('and').map((part, i, arr) => (
                 <React.Fragment key={i}>
                   {i === 0 ? part : <><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"><br />and {part}</span></>}
                 </React.Fragment>
               ))}
             </>
          ) : (
            <>Remember the goal <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">and never give up</span></>
          )}
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          {settings.heroSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
          <button
            onClick={onRegisterClick}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            Register Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-sm active:scale-95"
          >
            <PlayCircle className="w-5 h-5 text-blue-600" />
            Watch Tutorials
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto w-full">
          {(settings.heroStats || []).map((stat, i) => (
            <div key={i} className="bg-white/50 backdrop-blur p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
