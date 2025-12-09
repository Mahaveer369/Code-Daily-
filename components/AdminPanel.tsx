
import React, { useState, useEffect } from 'react';
import { CourseModule, UserProfile } from '../types';
import { db } from '../services/db';
import { generateLessonContent } from '../services/gemini';
import { COURSES } from './LearningModule';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users'>('overview');
  const [analytics, setAnalytics] = useState(db.getAnalytics());
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    setUsers(Object.values(db.getUsers()));
  }, []);

  const handleBatchGenerate = async () => {
    if (!window.confirm("Start batch generation? This may take time.")) return;
    
    setIsGenerating(true);
    setLogs(prev => [...prev, "Starting batch generation process..."]);

    const missingModules: { module: CourseModule, courseTitle: string, category: string }[] = [];

    COURSES.forEach(course => {
      course.modules.forEach(module => {
        if (!db.hasLesson(module.id)) {
          missingModules.push({ module, courseTitle: course.title, category: course.category });
        }
      });
    });

    setLogs(prev => [...prev, `Found ${missingModules.length} missing modules.`]);

    for (const item of missingModules) {
      setLogs(prev => [...prev, `Generating: ${item.module.title}...`]);
      try {
        await generateLessonContent(item.module.id, item.module.title, item.category);
        setLogs(prev => [...prev, `✅ Success: ${item.module.title}`]);
        setAnalytics(db.getAnalytics()); 
        await new Promise(r => setTimeout(r, 2000));
      } catch (error) {
        setLogs(prev => [...prev, `❌ Failed: ${item.module.title}`]);
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
         <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
             <span className="bg-red-500/10 text-red-500 p-2 rounded-lg">🛡️</span>
             Admin Command Center
           </h1>
           <p className="text-gray-400 mt-1">System Health: <span className="text-green-400 font-bold">{analytics.systemHealth}% Optimal</span></p>
         </div>
         
         <div className="flex bg-gray-900 p-1 rounded-lg">
            {['overview', 'content', 'users'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
               >
                 {tab}
               </button>
            ))}
         </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
             {[
               { label: 'Total Users', val: analytics.totalUsers, color: 'text-blue-400' },
               { label: 'Active (24h)', val: analytics.activeUsers24h, color: 'text-green-400' },
               { label: 'Modules Live', val: analytics.totalModulesGenerated, color: 'text-purple-400' },
               { label: 'System Load', val: 'Low', color: 'text-yellow-400' },
             ].map((stat, i) => (
               <div key={i} className="bg-card border border-gray-800 p-6 rounded-xl">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.label}</div>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.val}</div>
               </div>
             ))}
          </div>

          <div className="lg:col-span-3 bg-card border border-gray-800 rounded-xl p-6">
             <h3 className="text-lg font-bold text-white mb-4">Growth Analytics</h3>
             <div className="h-64 flex items-end justify-between gap-2 px-4 pb-4 border-b border-gray-700/50">
                {/* Simulated Chart Bars */}
                {[30, 45, 35, 60, 55, 70, 85].map((h, i) => (
                   <div key={i} className="w-full bg-blue-500/20 hover:bg-blue-500/40 rounded-t-md relative group transition-all" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {h * 12} Users
                      </div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between mt-2 text-xs text-gray-500 px-4">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </div>

          <div className="lg:col-span-1 bg-card border border-gray-800 rounded-xl p-6">
             <h3 className="text-lg font-bold text-white mb-4">Recent Logs</h3>
             <div className="space-y-3 overflow-y-auto max-h-64 text-xs font-mono text-gray-400">
                {analytics.recentActivity.map((log, i) => (
                  <div key={i} className="border-l-2 border-gray-700 pl-3 py-1">
                    <span className="text-gray-500 block text-[10px]">{new Date().toLocaleTimeString()}</span>
                    {log}
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-gray-800 rounded-xl p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white">Content Generation</h3>
               <button 
                  onClick={handleBatchGenerate}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${isGenerating ? 'bg-gray-700 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 text-white'}`}
               >
                 {isGenerating ? 'Generating...' : 'Auto-Fill Missing Modules'}
               </button>
             </div>

             <div className="space-y-4 max-h-[500px] overflow-y-auto bg-gray-900/50 rounded-lg p-4 font-mono text-xs">
                {logs.length === 0 ? <span className="text-gray-600">Waiting for command...</span> : logs.map((l, i) => (
                  <div key={i} className="text-gray-300 border-b border-gray-800/50 py-1">{l}</div>
                ))}
             </div>
          </div>

          <div className="bg-card border border-gray-800 rounded-xl p-6">
             <h3 className="text-xl font-bold text-white mb-6">Course Status</h3>
             <div className="space-y-4">
                {COURSES.map(course => {
                  const cached = course.modules.filter(m => db.hasLesson(m.id)).length;
                  const total = course.modules.length;
                  const pct = Math.round((cached/total)*100);
                  
                  return (
                    <div key={course.id}>
                       <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{course.title}</span>
                          <span className={pct === 100 ? "text-green-400" : "text-yellow-400"}>{cached}/{total}</span>
                       </div>
                       <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${pct === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${pct}%` }}></div>
                       </div>
                    </div>
                  )
                })}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
         <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-400">
               <thead className="bg-gray-800 text-gray-200 uppercase font-bold text-xs">
                  <tr>
                     <th className="px-6 py-4">User</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Streak</th>
                     <th className="px-6 py-4">XP</th>
                     <th className="px-6 py-4">Last Login</th>
                     <th className="px-6 py-4">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-800">
                  {users.map(u => (
                     <tr key={u.id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                           <div className="text-white font-medium">{u.name}</div>
                           <div className="text-xs">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {u.role}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-orange-400 font-bold">{u.streak} 🔥</td>
                        <td className="px-6 py-4 text-white">{u.xp}</td>
                        <td className="px-6 py-4 font-mono text-xs">{new Date(u.lastLogin).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                           <button className="text-blue-400 hover:text-white mr-2">Edit</button>
                           <button className="text-red-400 hover:text-white">Ban</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )}

    </div>
  );
};

export default AdminPanel;
