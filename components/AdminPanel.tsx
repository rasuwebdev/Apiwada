
import React, { useState, useRef, useEffect } from 'react';
import { getDB, updateUser, getUserByIndex, getAllStudents, exportStudentsToCSV, getSettings, saveSettings, getCourses, saveCourses } from '../services/dbService';
import { User, SiteSettings, Course, Mark, CourseVideo, LiveSession, FreeVideo, ExamYearStars, TopStudent } from '../types';
import { 
  Users, Search, PlusCircle, PenTool, CheckCircle, Download, Layout, Save, Info, 
  Camera, Video, Trash2, Edit3, Plus, Palette, Image as ImageIcon, Upload, 
  ArrowLeft, Shield, Globe, BookOpen, Settings2, Key, Radio, Clock, X, Star, Monitor
} from 'lucide-react';

const AdminPanel: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const isAdmin1 = currentUser?.contact === 'ADMIN1';
  const isAdmin2 = currentUser?.contact === 'ADMIN2';
  const hasBrandingAccess = isAdmin1 || isAdmin2;

  const [activeTab, setActiveTab] = useState<'students' | 'site' | 'courses' | 'branding' | 'hero'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [newMarkLabel, setNewMarkLabel] = useState<string>('');
  const [newMarkScore, setNewMarkScore] = useState<string>('');
  const [resetPassword, setResetPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const tutorInputRef = useRef<HTMLInputElement>(null);

  const [allCourses, setAllCourses] = useState<Course[]>(getCourses());
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [students, setStudents] = useState<User[]>(getAllStudents());

  useEffect(() => {
    setStudents(getAllStudents());
  }, [activeTab, message]);

  const handleUpdateSettings = () => {
    saveSettings(settings);
    setMessage('Platform content updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateCourses = () => {
    saveCourses(allCourses);
    setMessage('Courses saved!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: 'New Module',
      description: 'Module description...',
      price: 3500,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      videos: [{ id: '', title: 'Lesson 1' }],
      durationMinutes: 120
    };
    setAllCourses([...allCourses, newCourse]);
  };

  const handleAddMark = () => {
    if (targetUser && newMarkScore) {
      const score = parseInt(newMarkScore);
      const label = newMarkLabel || `Exam ${(targetUser.marks?.length || 0) + 1}`;
      const newMark: Mark = { label, score, date: new Date().toISOString() };
      const updatedUser = { ...targetUser, marks: [...(targetUser.marks || []), newMark] };
      updateUser(updatedUser);
      setTargetUser(updatedUser);
      setNewMarkScore('');
      setNewMarkLabel('');
      setMessage(`Added mark to ${targetUser.name}`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handlePasswordReset = () => {
    if (targetUser && resetPassword) {
      const updatedUser = { ...targetUser, password: resetPassword };
      updateUser(updatedUser);
      setTargetUser(updatedUser);
      setResetPassword('');
      setMessage(`Password updated for ${targetUser.name}`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleUploadFile = (type: 'logo' | 'bg' | 'tutor', file: File) => {
    if (file.size > 1024 * 1024) {
      setMessage('Max size 1MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'logo') setSettings({ ...settings, logoUrl: result });
      else if (type === 'bg') setSettings({ ...settings, backgroundImages: [result] });
      else if (type === 'tutor') setSettings({ ...settings, heroTutorImage: result });
    };
    reader.readAsDataURL(file);
  };

  const updateStar = (yearIdx: number, studentIdx: number, field: keyof TopStudent, value: any) => {
    const newStars = [...(settings.topStars || [])];
    newStars[yearIdx].students[studentIdx] = { ...newStars[yearIdx].students[studentIdx], [field]: value };
    setSettings({ ...settings, topStars: newStars });
  };

  const addStar = (yearIdx: number) => {
    const newStars = [...(settings.topStars || [])];
    if (newStars[yearIdx].students.length >= 5) return;
    newStars[yearIdx].students.push({ rank: newStars[yearIdx].students.length + 1, name: '', index: '', score: '' });
    setSettings({ ...settings, topStars: newStars });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.indexNumber.includes(searchQuery) ||
    s.contact.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 mt-10">
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black">HQ Console</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{currentUser?.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setActiveTab('students'); setTargetUser(null); }} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'students' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
            <Users className="w-4 h-4" /> Students
          </button>
          <button onClick={() => setActiveTab('courses')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'courses' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
            <BookOpen className="w-4 h-4" /> Courses
          </button>
          <button onClick={() => setActiveTab('hero')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'hero' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
            <Monitor className="w-4 h-4" /> Hero & Stars
          </button>
          <button onClick={() => setActiveTab('site')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'site' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
            <Globe className="w-4 h-4" /> Site
          </button>
          {isAdmin1 && (
            <button onClick={() => setActiveTab('branding')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'branding' ? 'bg-purple-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
              <Palette className="w-4 h-4" /> Branding
            </button>
          )}
        </div>
      </div>

      {message && <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100 font-black text-center animate-in zoom-in-95">{message}</div>}

      {activeTab === 'hero' && (
        <div className="space-y-12 animate-in fade-in">
          {/* Hero Content Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-8">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Monitor className="text-blue-600" /> Home Hero Customization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Top Badge Text</label>
                 <input className="w-full p-3 bg-slate-50 border rounded-xl font-bold" value={settings.heroBadge} onChange={e => setSettings({...settings, heroBadge: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Main Title</label>
                 <input className="w-full p-3 bg-slate-50 border rounded-xl font-bold" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} />
               </div>
               <div className="md:col-span-2 space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Hero Subtitle</label>
                 <textarea className="w-full p-3 bg-slate-50 border rounded-xl font-bold h-24" value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} />
               </div>
               
               {/* Tutor Image Upload */}
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Tutor PNG Image (Remover background)</label>
                  <div className="flex items-center gap-4">
                     <div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden">
                        {settings.heroTutorImage && <img src={settings.heroTutorImage} className="w-full h-full object-contain" />}
                     </div>
                     <button onClick={() => tutorInputRef.current?.click()} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold">Update Tutor Image</button>
                     <input type="file" ref={tutorInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUploadFile('tutor', e.target.files[0])} />
                  </div>
               </div>
            </div>

            {/* Stats Editor */}
            <div className="space-y-4 pt-6 border-t">
               <h4 className="text-sm font-black text-slate-800 uppercase">Hero Statistics Counters</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(settings.heroStats || []).map((stat, i) => (
                    <div key={i} className="space-y-2 p-4 bg-slate-50 rounded-2xl border">
                       <input className="w-full p-2 text-xs font-black border-b" value={stat.value} onChange={e => {
                         const news = [...settings.heroStats]; news[i].value = e.target.value; setSettings({...settings, heroStats: news});
                       }} placeholder="Value (e.g. 12k+)" />
                       <input className="w-full p-2 text-[10px] font-bold text-slate-400" value={stat.label} onChange={e => {
                         const news = [...settings.heroStats]; news[i].label = e.target.value; setSettings({...settings, heroStats: news});
                       }} placeholder="Label (e.g. Students)" />
                    </div>
                  ))}
               </div>
            </div>
            <button onClick={handleUpdateSettings} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Save Hero Changes</button>
          </div>

          {/* Monthly Stars Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-10">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Star className="text-yellow-500 fill-yellow-500" /> Monthly Top Stars (Golden List)
            </h3>
            
            <div className="space-y-12">
               {(settings.topStars || []).map((yearStars, yIdx) => (
                 <div key={yearStars.year} className="space-y-4 border-l-4 border-yellow-400 pl-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-lg font-black text-slate-700">{yearStars.year} Batch Top 5</h4>
                       <button onClick={() => addStar(yIdx)} className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-yellow-100"><Plus className="w-3 h-3"/> Add Student</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                       {yearStars.students.map((st, sIdx) => (
                         <div key={sIdx} className="bg-slate-50 p-4 rounded-2xl space-y-3 relative group border">
                            <button onClick={() => {
                              const news = [...settings.topStars]; news[yIdx].students = news[yIdx].students.filter((_, i) => i !== sIdx); setSettings({...settings, topStars: news});
                            }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3"/></button>
                            <div className="text-[10px] font-black text-slate-400 uppercase">RANK {st.rank}</div>
                            <input className="w-full p-2 text-xs font-bold border rounded-lg" placeholder="Student Name" value={st.name} onChange={e => updateStar(yIdx, sIdx, 'name', e.target.value)} />
                            <input className="w-full p-2 text-[10px] font-bold border rounded-lg" placeholder="Index Number" value={st.index} onChange={e => updateStar(yIdx, sIdx, 'index', e.target.value)} />
                            <input className="w-full p-2 text-[10px] font-bold border rounded-lg" placeholder="Score/Note (e.g. 98%)" value={st.score} onChange={e => updateStar(yIdx, sIdx, 'score', e.target.value)} />
                         </div>
                       ))}
                       {yearStars.students.length === 0 && <div className="col-span-5 text-center py-6 text-slate-300 font-bold italic text-sm">No stars listed for this year yet.</div>}
                    </div>
                 </div>
               ))}
            </div>
            <button onClick={handleUpdateSettings} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg">Save Golden Stars List</button>
          </div>
        </div>
      )}

      {activeTab === 'students' && !targetUser && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by Index, Name or Contact..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button onClick={exportStudentsToCSV} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 w-full md:w-auto hover:bg-green-700 transition-colors">
              <Download className="w-5 h-5" /> Export Data
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Index</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map(student => (
                    <tr key={student.indexNumber} className="hover:bg-blue-50/30 transition-colors cursor-pointer group" onClick={() => setTargetUser(student)}>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl font-black text-sm">{student.indexNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{student.school}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">{student.contact}</td>
                      <td className="px-6 py-4 text-right">
                        <Settings2 className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && targetUser && (
        <div className="space-y-6 animate-in slide-in-from-left duration-300">
          <button onClick={() => setTargetUser(null)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-all bg-white px-4 py-2 rounded-full border shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-8">
              <div className="flex items-center gap-6 border-b pb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                  {targetUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{targetUser.name}</h3>
                  <p className="text-sm font-bold text-slate-400">Index: {targetUser.indexNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><Key className="w-4 h-4" /> Security Settings</h4>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    placeholder="Reset Password (8 chars + special)" 
                    className="flex-1 p-3 bg-slate-50 rounded-xl border text-sm font-bold" 
                    value={resetPassword}
                    onChange={e => setResetPassword(e.target.value)}
                  />
                  <button onClick={handlePasswordReset} className="bg-red-600 text-white px-6 py-2 rounded-xl font-black text-xs">RESET</button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest"><PenTool className="w-4 h-4" /> Add Marks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Paper Name" className="p-3 bg-slate-50 rounded-xl border text-sm" value={newMarkLabel} onChange={e => setNewMarkLabel(e.target.value)} />
                  <div className="flex gap-2">
                    <input type="number" placeholder="Score" className="flex-1 p-3 bg-slate-50 rounded-xl border text-sm" value={newMarkScore} onChange={e => setNewMarkScore(e.target.value)} />
                    <button onClick={handleAddMark} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-sm">ADD</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest"><PlusCircle className="w-4 h-4 text-green-500" /> Active Course Access</h4>
              <div className="space-y-3">
                {allCourses.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
                    <div className="text-sm font-black text-slate-800">{course.title}</div>
                    <button 
                      onClick={() => {
                        const active = (targetUser.activeCourses || []).includes(course.id);
                        const updated = active 
                          ? targetUser.activeCourses.filter(id => id !== course.id)
                          : [...(targetUser.activeCourses || []), course.id];
                        const updatedUser = { ...targetUser, activeCourses: updated };
                        updateUser(updatedUser);
                        setTargetUser(updatedUser);
                      }} 
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${targetUser.activeCourses?.includes(course.id) ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}
                    >
                      {targetUser.activeCourses?.includes(course.id) ? 'REVOKE' : 'GRANT'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-8 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-6">
             <h3 className="text-2xl font-black">Course Catalog</h3>
             <button onClick={handleAddCourse} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5" /> Add New Course
             </button>
          </div>
          <div className="space-y-8">
            {allCourses.map((course, idx) => (
              <div key={course.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6 relative group">
                <button onClick={() => setAllCourses(allCourses.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5" /></button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Title</label>
                    <input className="w-full p-3 bg-white border rounded-xl text-sm font-bold" value={course.title} onChange={e => {
                      const newC = [...allCourses]; newC[idx].title = e.target.value; setAllCourses(newC);
                    }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Price</label>
                    <input type="number" className="w-full p-3 bg-white border rounded-xl text-sm font-bold" value={course.price} onChange={e => {
                      const newC = [...allCourses]; newC[idx].price = parseInt(e.target.value); setAllCourses(newC);
                    }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Duration (Min)</label>
                    <input type="number" className="w-full p-3 bg-white border rounded-xl text-sm font-bold" value={course.durationMinutes} onChange={e => {
                      const newC = [...allCourses]; newC[idx].durationMinutes = parseInt(e.target.value); setAllCourses(newC);
                    }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-500 uppercase">Lesson Videos</h4>
                    <button onClick={() => {
                      const newC = [...allCourses];
                      newC[idx].videos = [...(newC[idx].videos || []), { id: '', title: `Lesson ${newC[idx].videos.length + 1}` }];
                      setAllCourses(newC);
                    }} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add Video</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(course.videos || []).map((v, vIdx) => (
                      <div key={vIdx} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                           <input placeholder="Video Title" className="w-full p-2 bg-slate-50 border rounded-lg text-xs" value={v.title} onChange={e => {
                             const newC = [...allCourses]; newC[idx].videos[vIdx].title = e.target.value; setAllCourses(newC);
                           }} />
                           <input placeholder="YouTube ID" className="w-full p-2 bg-slate-50 border rounded-lg text-xs" value={v.id} onChange={e => {
                             const newC = [...allCourses]; newC[idx].videos[vIdx].id = e.target.value; setAllCourses(newC);
                           }} />
                        </div>
                        <button onClick={() => {
                          const newC = [...allCourses];
                          newC[idx].videos = newC[idx].videos.filter((_, i) => i !== vIdx);
                          setAllCourses(newC);
                        }} className="p-2 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleUpdateCourses} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl">Commit All Changes</button>
        </div>
      )}

      {activeTab === 'site' && (
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-12 animate-in fade-in">
           <div className="flex items-center justify-between border-b pb-6">
            <h3 className="text-2xl font-black">Global Content</h3>
          </div>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-slate-800 flex items-center gap-2"><Radio className="text-red-600" /> Managed Live Sessions</h4>
              <button onClick={() => setSettings({ ...settings, liveSessions: [...(settings.liveSessions || []), { id: `live-${Date.now()}`, title: 'Live Now', thumbnail: '', youtubeId: '', examYear: '2026', startTime: new Date().toISOString(), durationMinutes: 60 }]})} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black">ADD LIVE SESSION</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.liveSessions?.map((session, idx) => (
                <div key={session.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Title</label>
                      <input className="w-full p-2 bg-white border rounded-xl text-xs font-bold" value={session.title} onChange={e => {
                        const newS = { ...settings }; newS.liveSessions[idx].title = e.target.value; setSettings(newS);
                      }} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">YouTube ID</label>
                      <input className="w-full p-2 bg-white border rounded-xl text-xs font-bold" value={session.youtubeId} onChange={e => {
                        const newS = { ...settings }; newS.liveSessions[idx].youtubeId = e.target.value; setSettings(newS);
                      }} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Batch</label>
                      <select className="w-full p-2 bg-white border rounded-xl text-xs font-bold" value={session.examYear} onChange={e => {
                        const newS = { ...settings }; newS.liveSessions[idx].examYear = e.target.value; setSettings(newS);
                      }}><option>2026</option><option>2027</option><option>2028</option><option>2029</option></select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Duration (Min)</label>
                      <input type="number" className="w-full p-2 bg-white border rounded-xl text-xs font-bold" value={session.durationMinutes} onChange={e => {
                        const newS = { ...settings }; newS.liveSessions[idx].durationMinutes = parseInt(e.target.value); setSettings(newS);
                      }} />
                    </div>
                  </div>
                  <button onClick={() => { const newS = { ...settings }; newS.liveSessions = newS.liveSessions.filter((_, i) => i !== idx); setSettings(newS); }} className="text-red-500 text-[10px] font-black">REMOVE</button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleUpdateSettings} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black">Save Site Information</button>
        </div>
      )}

      {activeTab === 'branding' && isAdmin1 && (
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-8">
           <h3 className="text-2xl font-black">Logo & Theme Branding</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <label className="text-sm font-black text-slate-700 uppercase tracking-wide">Platform Logo</label>
                 <button onClick={() => logoInputRef.current?.click()} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black">Upload Logo</button>
                 <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUploadFile('logo', e.target.files[0])} />
              </div>
              <div className="space-y-4">
                 <label className="text-sm font-black text-slate-700 uppercase tracking-wide">Background Overlay</label>
                 <button onClick={() => bgInputRef.current?.click()} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black">Upload Background</button>
                 <input type="file" ref={bgInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUploadFile('bg', e.target.files[0])} />
              </div>
           </div>
           <button onClick={handleUpdateSettings} className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black">Commit Branding Changes</button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
