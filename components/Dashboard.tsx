
import React, { useEffect, useState } from 'react';
import { UserProfile, CourseProgress, Certificate, Bookmark } from '../types';
import { COURSES } from './LearningModule';
import { db } from '../services/db';

interface DashboardProps {
  progress: UserProfile;
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, userName }) => {
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    setUserProgress(db.getUserProgress(progress.id));
    setBookmarks(db.getBookmarks(progress.id));
    setCertificates(db.getCertificates(progress.id));
  }, [progress.id]);

  const getCourseProgressPercent = (courseId: string) => {
    const prog = userProgress.find(p => p.courseId === courseId);
    if (!prog) return 0;
    return Math.round((prog.completedModuleIds.length / prog.totalModules) * 100);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}!</h1>
            <p className="text-blue-100/80 max-w-lg">You've maintained a {progress.streak} day streak. Keep pushing your limits.</p>
            
            <div className="flex gap-3 mt-6">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-xl">🔥</span> <span className="font-mono font-bold">{progress.streak} Day Streak</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-xl">⚡</span> <span className="font-mono font-bold">{progress.xp} XP</span>
               </div>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md w-full md:w-auto min-w-[200px]">
             <div className="text-xs text-blue-200 uppercase tracking-wider mb-2">Next Milestone</div>
             <div className="text-2xl font-bold text-white mb-1">Level {progress.level + 1}</div>
             <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: `${(progress.xp % 1000) / 10}%` }}></div>
             </div>
             <div className="text-right text-xs text-blue-300 mt-1">{1000 - (progress.xp % 1000)} XP to go</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Course Progress */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             Current Courses
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COURSES.map(course => {
                 const percent = getCourseProgressPercent(course.id);
                 return (
                   <div key={course.id} className="bg-card border border-gray-800 p-5 rounded-2xl hover:border-gray-700 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 rounded-xl bg-gray-800 text-white group-hover:scale-110 transition-transform">
                            {/* Simple Icon placeholder */}
                            <span className="text-xl">
                              {course.icon === 'python' ? '🐍' : course.icon === 'database' ? '🗄️' : '💻'}
                            </span>
                         </div>
                         <div className="text-right">
                            <div className="text-2xl font-bold text-white">{percent}%</div>
                            <div className="text-xs text-gray-500">Completed</div>
                         </div>
                      </div>
                      <h3 className="font-bold text-white mb-1">{course.title}</h3>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                           style={{ width: `${percent}%` }}
                         ></div>
                      </div>
                      <button className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium text-gray-300 transition-colors">
                         {percent === 0 ? 'Start Course' : percent === 100 ? 'Review' : 'Continue Learning'}
                      </button>
                   </div>
                 )
              })}
           </div>

           {/* Bookmarks Section */}
           {bookmarks.length > 0 && (
             <div className="mt-8">
               <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                 Saved Notes
               </h2>
               <div className="grid gap-3">
                 {bookmarks.map(b => (
                   <div key={b.id} className="bg-[#161b22] border border-gray-800 p-4 rounded-xl flex justify-between items-center group">
                      <div>
                        <div className="text-sm font-bold text-blue-400 mb-1">{b.moduleTitle}</div>
                        <p className="text-gray-400 text-sm italic">"{b.note}"</p>
                      </div>
                      <div className="text-xs text-gray-600 font-mono">
                        {new Date(b.timestamp).toLocaleDateString()}
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Right Col: Achievements & Certs */}
        <div className="space-y-6">
           
           {/* Badges */}
           <div className="bg-card border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Badges & Achievements</h3>
              <div className="grid grid-cols-4 gap-2">
                 {progress.badges.map(badge => (
                   <div key={badge.id} className="flex flex-col items-center group relative cursor-help">
                      <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl shadow-lg group-hover:bg-gray-700 transition-colors">
                         {badge.icon}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                         {badge.name}
                      </div>
                   </div>
                 ))}
                 {/* Placeholders */}
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gray-800/30 border border-gray-800/50 flex items-center justify-center text-gray-700 text-xl grayscale opacity-50">
                       🏆
                    </div>
                 ))}
              </div>
           </div>

           {/* Certificates */}
           <div className="bg-card border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Certifications</h3>
              {certificates.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                   Complete a course to earn your first certificate.
                </div>
              ) : (
                <div className="space-y-3">
                   {certificates.map(cert => (
                     <div key={cert.id} className="p-3 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl flex items-center justify-between">
                        <div>
                           <div className="text-white font-bold text-sm">{cert.courseTitle}</div>
                           <div className="text-xs text-gray-500 font-mono">Issued: {cert.issueDate}</div>
                        </div>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors" title="Download PDF">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                     </div>
                   ))}
                </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
