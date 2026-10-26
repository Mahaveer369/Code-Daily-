import React from 'react';
import { UserProfile, Tab } from '../types';

interface SidebarProps {
  user: UserProfile;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, handleLogout }) => {
  return (
    <aside className="w-20 lg:w-72 bg-[#1e293b]/30 backdrop-blur-xl border-r border-gray-800 flex flex-col justify-between py-8 z-20 transition-all">
      <div>
        <div className="px-4 lg:px-8 mb-10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 transform rotate-3">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <span className="hidden lg:block font-bold text-xl tracking-tight text-white">Code IIT Out</span>
        </div>

        <nav className="px-4 space-y-2">
          {[
            {
              id: 'dashboard', label: 'Dashboard', role: 'user', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              )
            },
            {
              id: 'learn', label: 'My Courses', role: 'user', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              )
            },
            {
              id: 'daily', label: 'Daily Challenges', role: 'user', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              )
            },
            {
              id: 'admin', label: 'Admin CMS', role: 'admin', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              )
            },
          ].filter(item => user.role === 'admin' || (user.role === 'user' && item.role !== 'admin')).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group font-medium ${activeTab === item.id
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <svg className={`w-5 h-5 shrink-0 transition-colors ${activeTab === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
              <span className="hidden lg:block whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="px-4 lg:px-6">
        <div className="bg-gray-900/40 rounded-2xl p-4 border border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold ring-2 ring-gray-700 text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{user.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role} Account</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center justify-center gap-2 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
