
import React, { useState, useRef } from 'react';
import { User, Course, Mark, CourseVideo } from '../types';
import { getCourses, updateUser } from '../services/dbService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Award, BookOpen, TrendingUp, CreditCard, Play, LogOut, Camera, Save, Key, Edit2, Upload, AlertCircle, Settings, X, List } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    profilePic: user.profilePic || '',
    password: user.password || ''
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allCourses = getCourses();
  const allMarksList: Mark[] = user.marks || [];
  const chartData = allMarksList.map((m, idx) => ({ name: m.label, score: m.score }));
  
  const latestMark = allMarksList.length > 0 ? allMarksList[allMarksList.length - 1].score : 0;
  const avgMark = allMarksList.length > 0 ? (allMarksList.reduce((acc, m) => acc + m.score, 0) / allMarksList.length).toFixed(1) : 0;

  const activeCourse = activeCourseId ? allCourses.find(c => c.id === activeCourseId) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      setError('Image must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditData({ ...editData, profilePic: reader.result as string });
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = () => {
    const updatedUser = { ...user, ...editData };
    updateUser(updatedUser);
    setIsEditingProfile(false);
  };

  const openCourse = (id: string) => {
    const course = allCourses.find(c => c.id === id);
    if (course) {
      setActiveCourseId(id);
      setSelectedVideo(course.videos?.[0] || null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start relative">
        <div className="relative group">
          {editData.profilePic ? (
            <img src={editData.profilePic} className="w-24 h-24 rounded-2xl object-cover shadow-md border-4 border-white" />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-inner">
              {user.name.charAt(0)}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-6 h-6 rounded-full shadow-sm"></div>
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="absolute -top-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {isEditingProfile ? (
          <div className="flex-1 space-y-4 w-full bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-black text-slate-800 flex items-center gap-2"><Settings className="w-5 h-5 text-blue-600" /> Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Display Name</label>
                <input className="w-full p-3 bg-white border rounded-xl text-sm" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Profile Picture (Max 1MB)</label>
                <div className="flex gap-2">
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 p-3 bg-white border rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                   >
                     <Upload className="w-4 h-4" /> Upload Image
                   </button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Change Password</label>
                <input type="password" placeholder="New Password" className="w-full p-3 bg-white border rounded-xl text-sm" value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})} />
              </div>
              <div className="flex items-end">
                <button onClick={handleUpdateProfile} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200"><Save className="w-4 h-4" /> Save Profile</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center md:text-left flex-1 space-y-1">
            <h2 className="text-3xl font-black text-slate-900">{user.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-slate-500">
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Award className="w-4 h-4 text-amber-500" /> Index: {user.indexNumber}</span>
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><BookOpen className="w-4 h-4 text-blue-500" /> Exam: {user.examYear}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-600 p-4 rounded-2xl text-center text-white shadow-lg">
              <div className="text-2xl font-black">{latestMark}%</div>
              <div className="text-[10px] uppercase font-bold opacity-70">Latest</div>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl text-center text-white shadow-lg">
              <div className="text-2xl font-black">{avgMark}%</div>
              <div className="text-[10px] uppercase font-bold opacity-70">Average</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-indigo-600" /> Exam Progress
            </h3>
            <div className="h-[250px] mb-8">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 font-bold italic">No results yet.</div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allMarksList.slice().reverse().map((mark, i) => (
                <div key={i} className="p-4 bg-slate-50 border rounded-2xl text-center">
                  <div className="text-lg font-black text-slate-800">{mark.score}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase truncate">{mark.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-indigo-600" /> Your Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.activeCourses?.length > 0 ? (
                user.activeCourses.map(id => {
                  const course = allCourses.find(c => c.id === id);
                  if (!course) return null;
                  return (
                    <div key={id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all shadow-sm flex flex-col justify-between h-40">
                      <div className="font-black text-slate-800 line-clamp-1">{course.title}</div>
                      <button 
                        onClick={() => openCourse(id)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4" /> Start Lessons
                      </button>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-2 py-12 text-center text-slate-400 font-bold italic">Enroll in courses to start learning.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {activeCourse && (
            <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl space-y-6 animate-in zoom-in-95 sticky top-24">
              <div className="flex items-center justify-between text-white">
                <h3 className="text-lg font-black truncate max-w-[80%]">{activeCourse.title}</h3>
                <button onClick={() => {setActiveCourseId(null); setSelectedVideo(null);}} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                   <X className="w-4 h-4" />
                </button>
              </div>
              
              {selectedVideo && <VideoPlayer user={user} course={activeCourse} videoId={selectedVideo.id} />}
              
              <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-white/40 uppercase flex items-center gap-2"><List className="w-3 h-3" /> Module Playlist</h4>
                 <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {activeCourse.videos?.map((v, i) => (
                       <button 
                        key={i} 
                        onClick={() => setSelectedVideo(v)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left text-xs font-bold ${selectedVideo?.id === v.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                       >
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${selectedVideo?.id === v.id ? 'bg-white/20' : 'bg-black/20'}`}>{i + 1}</div>
                          <span className="truncate">{v.title}</span>
                       </button>
                    ))}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
