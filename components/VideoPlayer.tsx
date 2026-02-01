
import React, { useState, useEffect, useRef } from 'react';
import { User, Course } from '../types';
import { updateUser } from '../services/dbService';
import { AlertTriangle, Clock, Lock } from 'lucide-react';

interface VideoPlayerProps {
  user: User;
  course: Course;
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ user, course, videoId }) => {
  const [seconds, setSeconds] = useState(user.watchTime[course.id] || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const maxAllowedSeconds = (course.durationMinutes + 60) * 60; // Duration + 1 Hour buffer
  const isExpired = seconds >= maxAllowedSeconds;

  useEffect(() => {
    if (isPlaying && !isExpired) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (next % 30 === 0) { 
            const updatedUser = { ...user };
            updatedUser.watchTime[course.id] = next;
            updateUser(updatedUser);
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isExpired, course.id, user]);

  const timeLeft = Math.max(0, maxAllowedSeconds - seconds);
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (isExpired) {
    return (
      <div className="aspect-video bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-white p-8 text-center space-y-4">
        <Lock className="w-16 h-16 text-red-500 animate-pulse" />
        <h3 className="text-2xl font-bold">Limit Reached</h3>
        <p className="text-slate-400 text-xs">Viewing limit exceeded for this module.</p>
        <div className="bg-red-500/10 border border-red-500/50 px-4 py-1 rounded-full text-red-400 text-[10px] font-bold">
          {formatTime(seconds)} / {formatTime(maxAllowedSeconds)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&enablejsapi=1`}
          className="w-full h-full"
          title={course.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => setIsPlaying(true)}
        ></iframe>
        
        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[10px] font-bold">
          <Clock className="w-3 h-3 text-blue-400" />
          LIMIT: {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-blue-50/10 border border-blue-500/30 p-3 rounded-2xl">
        <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0" />
        <p className="text-[10px] text-blue-200 leading-tight">
          Sharing lessons is illegal. Violators face permanent account termination.
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
