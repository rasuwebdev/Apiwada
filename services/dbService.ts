
import { User, SiteSettings, Course } from '../types';
import { INITIAL_INDEX_NUMBER, MOCK_COURSES } from '../constants';

const STORAGE_KEY = 'apiwada_db_v2';
const SETTINGS_KEY = 'apiwada_settings_v2';
const COURSES_KEY = 'apiwada_courses_v2';

const DEFAULT_SETTINGS: SiteSettings = {
  freeVideos: [
    { id: 'dQw4w9WgXcQ', title: 'Introduction to Mechanics' }
  ],
  galleryImages: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1516534775068-ba3e84529519?auto=format&fit=crop&q=80&w=800'
  ],
  contactEmail: 'rasumotivation.contact@gmail.com',
  contactPhone: '071 019 5000',
  bankDetails: 'Bank: BOC, Branch: Colombo, A/C: 1234567890',
  logoUrl: '',
  backgroundImages: [],
  liveSessions: [],
  heroBadge: 'The best physics class in Srilanka',
  heroTitle: 'Remember the goal and never give up',
  heroSubtitle: 'Premium Physics coaching by Niroshan Jayathunge. Join the most elite educational community in the island.',
  heroTutorImage: 'https://images.unsplash.com/photo-1544717297-fa154daaf762?auto=format&fit=crop&q=80&w=400', // Placeholder
  heroStats: [
    { label: 'Active Students', value: '12k+' },
    { label: 'Island Ranks', value: '250+' },
    { label: 'Experience', value: '15+ Years' },
    { label: 'Courses', value: '50+' },
  ],
  topStars: [
    { year: '2026', students: [] },
    { year: '2027', students: [] },
    { year: '2028', students: [] },
    { year: '2029', students: [] }
  ]
};

const INITIAL_COURSES: Course[] = MOCK_COURSES;

export const getDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { users: [], nextIndex: INITIAL_INDEX_NUMBER };
};

export const saveDB = (db: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const getSettings = (): SiteSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: SiteSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getCourses = (): Course[] => {
  const data = localStorage.getItem(COURSES_KEY);
  return data ? JSON.parse(data) : INITIAL_COURSES;
};

export const saveCourses = (courses: Course[]) => {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

export const registerUser = (userData: Omit<User, 'indexNumber' | 'role' | 'activeCourses' | 'marks' | 'watchTime'>): User => {
  const db = getDB();
  const newUser: User = {
    ...userData,
    indexNumber: db.nextIndex.toString(),
    role: 'student',
    activeCourses: [],
    marks: [],
    watchTime: {}
  };
  
  db.users.push(newUser);
  db.nextIndex += 1;
  saveDB(db);
  return newUser;
};

export const getUserByContact = (contact: string): User | undefined => {
  const db = getDB();
  return db.users.find((u: User) => u.contact === contact);
};

export const getUserByIndex = (index: string): User | undefined => {
  const db = getDB();
  return db.users.find((u: User) => u.indexNumber === index);
};

export const getAllStudents = (): User[] => {
  const db = getDB();
  return db.users.filter((u: User) => u.role === 'student');
};

export const updateUser = (updatedUser: User) => {
  const db = getDB();
  const index = db.users.findIndex((u: User) => u.indexNumber === updatedUser.indexNumber);
  if (index !== -1) {
    db.users[index] = updatedUser;
    saveDB(db);
    const current = localStorage.getItem('apiwada_user');
    if (current) {
      const parsed = JSON.parse(current);
      if (parsed.indexNumber === updatedUser.indexNumber) {
        localStorage.setItem('apiwada_user', JSON.stringify(updatedUser));
      }
    }
  }
};

export const exportStudentsToCSV = () => {
  const db = getDB();
  const users = db.users as User[];
  
  const headers = ['Index', 'Name', 'Exam Year', 'School', 'Birthday', 'Contact', 'Role', 'Active Courses', 'Marks Count'];
  const rows = users.map(u => [
    u.indexNumber,
    u.name,
    u.examYear,
    u.school,
    u.birthday,
    u.contact,
    u.role,
    (u.activeCourses || []).join('; '),
    (u.marks || []).length
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `apiwada_students_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
