
export interface Mark {
  label: string;
  score: number;
  date: string;
}

export interface CourseVideo {
  id: string;
  title: string;
}

export interface LiveSession {
  id: string;
  thumbnail: string;
  title: string;
  youtubeId: string;
  examYear: string;
  startTime: string; // ISO string
  durationMinutes: number;
}

export interface TopStudent {
  name: string;
  index: string;
  rank: number;
  score?: string;
}

export interface ExamYearStars {
  year: string;
  students: TopStudent[];
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface User {
  indexNumber: string;
  name: string;
  password?: string;
  examYear: string;
  school: string;
  birthday: string;
  contact: string;
  profilePic?: string; 
  role: 'student' | 'admin';
  activeCourses: string[]; 
  marks: Mark[];
  watchTime: Record<string, number>;
}

export interface FreeVideo {
  id: string;
  title: string;
}

export interface SiteSettings {
  freeVideos: FreeVideo[];
  galleryImages: string[];
  contactEmail: string;
  contactPhone: string;
  bankDetails: string;
  logoUrl?: string; 
  backgroundImages?: string[]; 
  liveSessions: LiveSession[];
  // Hero Customization
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTutorImage: string;
  heroStats: HeroStat[];
  // Top Students
  topStars: ExamYearStars[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  videos: CourseVideo[]; 
  durationMinutes: number;
}

export interface Review {
  id: string;
  studentName: string;
  content: string;
  rating: number;
  date: string;
}

export enum AppRoute {
  Home = 'home',
  Profile = 'profile',
  About = 'about',
  Courses = 'courses',
  Gallery = 'gallery',
  Admin = 'admin'
}
