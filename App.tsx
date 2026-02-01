
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { AppRoute, User, Course, SiteSettings, LiveSession, ExamYearStars } from './types';
import { LOGO_URL } from './constants';
import { getSettings, getCourses } from './services/dbService';
import { ChevronRight, Play, Mail, Phone, Building2, Youtube, Radio, X, Lock, AlertCircle, Star, Crown, Award } from 'lucide-react';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.Home);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSettings());
  const [courses, setCourses] = useState<Course[]>(getCourses());
  const [activeLiveSession, setActiveLiveSession] = useState<LiveSession | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    // Call the new async functions from dbService
    const settings = await getSettings();
    const courseList = await getCourses();
    
    setSiteSettings(settings);
    setCourses(courseList);
  };

  fetchData();
  
  // Update your interval to be async as well
  const interval = setInterval(async () => {
    const settings = await getSettings();
    setSiteSettings(settings);
  }, 10000); 

  return () => clearInterval(interval);
}, []);
  
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'U') || e.key === 'F12') {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    const saved = localStorage.getItem('apiwada_user');
    if (saved) setCurrentUser(JSON.parse(saved));
    
    const interval = setInterval(() => {
      const settings = getSettings();
      setSiteSettings(settings);
      setCourses(getCourses());

      // Check for active live sessions
      const now = new Date();
      const currentLive = settings.liveSessions.find(s => {
        const start = new Date(s.startTime);
        const end = new Date(start.getTime() + s.durationMinutes * 60000);
        return now >= start && now <= end;
      });
      setActiveLiveSession(currentLive || null);
    }, 5000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const bgCanvas = document.getElementById('bg-canvas');
    if (siteSettings.backgroundImages?.[0]) {
      document.body.style.backgroundImage = `url(${siteSettings.backgroundImages[0]})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      if (bgCanvas) bgCanvas.style.opacity = '0.3';
    }
  }, [siteSettings]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('apiwada_user');
    setCurrentRoute(AppRoute.Home);
  };

  const handleLiveClick = () => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }
    if (currentUser.examYear !== activeLiveSession?.examYear && currentUser.role !== 'admin') {
      setLiveError(`This live session is exclusively for the ${activeLiveSession?.examYear} batch.`);
      setTimeout(() => setLiveError(null), 5000);
      return;
    }
    window.open(`https://www.youtube.com/watch?v=${activeLiveSession.youtubeId}`, '_blank');
  };

  const MonthlyStars = ({ stars }: { stars: ExamYearStars[] }) => {
    const filteredYears = stars.filter(y => y.students && y.students.length > 0);
    if (filteredYears.length === 0) return null;

    return (
      <section className="space-y-16 py-20 px-4 bg-gradient-to-b from-transparent via-slate-100/50 to-transparent">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
             <div className="bg-yellow-400 p-3 rounded-full shadow-lg shadow-yellow-200 animate-pulse">
                <Crown className="w-8 h-8 text-white" />
             </div>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Monthly <span className="text-yellow-600">Golden Stars</span></h2>
          <p className="text-slate-500 max-w-xl mx-auto font-bold uppercase tracking-widest text-xs">Recognizing Academic Excellence across all Batches</p>
        </div>

        <div className="max-w-7xl mx-auto space-y-24">
          {filteredYears.map((yearGroup) => (
            <div key={yearGroup.year} className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200"></div>
                  <h3 className="text-2xl font-black text-slate-800 bg-white px-6 py-2 rounded-full border shadow-sm">
                    {yearGroup.year} Batch
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {yearGroup.students.slice(0, 5).map((student, idx) => (
                    <div 
                      key={student.index} 
                      className={`relative p-6 rounded-[2rem] border transition-all hover:scale-105 ${
                        idx === 0 
                        ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 text-white border-yellow-300 shadow-xl shadow-yellow-200/50' 
                        : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                        idx === 0 ? 'bg-white text-yellow-600' : 'bg-slate-900 text-white'
                      }`}>
                        {student.rank}
                      </div>
                      <div className="text-center pt-4 space-y-1">
                        <div className="font-black text-sm truncate uppercase">{student.name}</div>
                        <div className={`text-[10px] font-bold ${idx === 0 ? 'text-yellow-100' : 'text-slate-400'}`}>INDEX: {student.index}</div>
                        {student.score && (
                          <div className={`mt-2 py-1 px-3 rounded-lg text-xs font-black inline-block ${
                            idx === 0 ? 'bg-white/20' : 'bg-slate-50 text-slate-600'
                          }`}>
                            {student.score}
                          </div>
                        )}
                      </div>
                      {idx === 0 && <Award className="absolute bottom-4 right-4 w-6 h-6 text-yellow-200 opacity-40" />}
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.Admin:
        return currentUser?.role === 'admin' ? <AdminPanel currentUser={currentUser} /> : <div className="p-20 text-center font-bold">Unauthorized</div>;
      
      case AppRoute.Profile:
        return currentUser ? <Dashboard user={currentUser} onLogout={handleLogout} /> : <div className="p-20 text-center font-bold">Please login to view dashboard.</div>;

      case AppRoute.Gallery:
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center">
              <h2 className="text-5xl font-black text-slate-900">Class Gallery</h2>
              <p className="text-slate-500 mt-2">Captured moments of academic dedication.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteSettings.galleryImages.filter(src => src).map((src, i) => (
                <div key={i} className="aspect-square bg-slate-200 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl hover:scale-[1.02] transition-transform">
                  <img src={src} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                </div>
              ))}
            </div>
          </div>
        );

      case AppRoute.About:
        return (
          <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-500">
            <div className="text-center space-y-6">
              <h2 className="text-6xl font-black text-slate-900">About ApiWada</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                Physics mastered with <span className="text-blue-600 font-bold">Niroshan Jayathunge</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900 border-b pb-4">Contact Info</h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl"><Mail className="text-blue-600" /></div>
                        <div>
                           <div className="text-xs font-bold text-slate-400 uppercase">Email</div>
                           <div className="font-bold text-slate-800">{siteSettings.contactEmail}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-xl"><Phone className="text-green-600" /></div>
                        <div>
                           <div className="text-xs font-bold text-slate-400 uppercase">Whatsapp</div>
                           <div className="font-bold text-slate-800">{siteSettings.contactPhone}</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-6">
                  <h3 className="text-2xl font-bold border-b border-white/10 pb-4">Bank Details</h3>
                  <div className="flex items-start gap-4">
                     <div className="bg-white/10 p-3 rounded-xl"><Building2 className="text-blue-400" /></div>
                     <div>
                        <div className="text-xs font-bold text-white/40 uppercase mb-2">Registration Payments</div>
                        <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{siteSettings.bankDetails}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case AppRoute.Courses:
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900">Physics Modules</h2>
              <p className="text-slate-500 mt-2">Comprehensive syllabus coverage with expert guidance.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all group">
                  <div className="relative h-48">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-extrabold text-blue-600 shadow-sm">
                      LKR {course.price}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">{course.title}</h3>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>{course.videos?.length || 0} Lectures</span>
                      <span>{Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m</span>
                    </div>
                    <button 
                      onClick={() => currentUser ? setCurrentRoute(AppRoute.Profile) : setShowLogin(true)}
                      className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-12">
            <Hero 
              onRegisterClick={() => setShowRegister(true)} 
              onExploreClick={() => setCurrentRoute(AppRoute.Courses)} 
              settings={siteSettings}
            />
            
            <MonthlyStars stars={siteSettings.topStars || []} />

            <section className="space-y-12 pb-20">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-slate-900">Free Tutorials</h2>
                <p className="text-slate-500 max-w-xl mx-auto">Access high-quality complimentary physics lessons.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {siteSettings.freeVideos.filter(v => v.id).map((video, idx) => (
                  <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <div className="aspect-video bg-slate-900 relative">
                       <iframe
                          src={`https://www.youtube.com/embed/${video.id}?rel=0&autoplay=0`}
                          className="w-full h-full"
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 truncate pr-4">{video.title || `Lesson #${idx+1}`}</h3>
                      <Youtube className="w-5 h-5 text-red-600 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col physics-gradient select-none">
      {/* Live Session Popup Notification */}
      {activeLiveSession && (
        <div className="fixed top-20 right-4 z-[90] animate-in slide-in-from-right duration-700">
           <div className="bg-white/90 backdrop-blur-xl border-4 border-red-500 rounded-3xl p-4 shadow-2xl max-w-sm flex items-center gap-4 relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-100 shadow-inner">
                 <img src={activeLiveSession.thumbnail} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">LIVE NOW</span>
                </div>
                <h4 className="font-black text-slate-800 text-sm truncate">{activeLiveSession.title}</h4>
                <div className="text-[10px] font-bold text-slate-400">BATCH: {activeLiveSession.examYear}</div>
                <button 
                  onClick={handleLiveClick}
                  className="w-full bg-red-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-700 transition-all shadow-md active:scale-95"
                >
                  Join Session
                </button>
              </div>
              <button onClick={() => setActiveLiveSession(null)} className="absolute -top-2 -right-2 bg-slate-800 text-white p-1 rounded-full"><X className="w-3 h-3"/></button>
           </div>
           {liveError && (
             <div className="mt-2 bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-center gap-2 text-[10px] font-black animate-in fade-in">
                <AlertCircle className="w-3 h-3" /> {liveError}
             </div>
           )}
        </div>
      )}

      <Navbar 
        currentRoute={currentRoute} 
        setRoute={setCurrentRoute} 
        currentUser={currentUser} 
        onLoginClick={() => setShowLogin(true)} 
        onLogout={handleLogout}
        logoUrl={siteSettings.logoUrl}
      />
      <main className="flex-1 w-full">{renderContent()}</main>
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={(u) => { setCurrentUser(u); localStorage.setItem('apiwada_user', JSON.stringify(u)); setShowLogin(false); }} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSuccess={(u) => { setCurrentUser(u); localStorage.setItem('apiwada_user', JSON.stringify(u)); setShowRegister(false); }} />}
    </div>
  );
};

export default App;
