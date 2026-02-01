
import React from 'react';
import { Course, Review } from './types';

export const INITIAL_INDEX_NUMBER = 8374000;

// Update this URL with your actual logo path
export const LOGO_URL = "https://placeholder.com/logo.png"; 

export const MOCK_COURSES: Course[] = [
  {
    id: 'phy-101',
    title: 'Mechanics & Relativity',
    description: 'Master the fundamentals of movement, forces, and Einstein theories.',
    price: 4500,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    // Fix: Removed deprecated videoCount and youtubeId, added videos array
    videos: [{ id: 'dQw4w9WgXcQ', title: 'Introduction to Mechanics' }],
    durationMinutes: 180 // 3 Hours
  },
  {
    id: 'phy-102',
    title: 'Electromagnetism',
    description: 'In-depth exploration of fields, circuits, and Maxwell equations.',
    price: 5200,
    thumbnail: 'https://images.unsplash.com/photo-1510172951991-859a69907ac2?auto=format&fit=crop&q=80&w=800',
    // Fix: Removed deprecated videoCount and youtubeId, added videos array
    videos: [{ id: 'tO6jP5xN0fU', title: 'Electromagnetism Basics' }],
    durationMinutes: 120
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    studentName: 'Kasun Perera',
    content: 'The best physics lectures I have ever attended. Highly recommended for AL students!',
    rating: 5,
    date: '2024-03-12'
  }
];

export const LOGO_SVG = (
  <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4"/>
    <path d="M30 70L50 30L70 70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40 55H60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" className="animate-spin-slow"/>
  </svg>
);
