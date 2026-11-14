import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import {
  LayoutDashboard,
  Bell,
  Calendar,
  FileCheck2,
  Building,
  BookmarkCheck,
  Users,
  BarChart3,
  X,
  GraduationCap,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { name: 'Paneli Kryesor', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Njoftime', path: '/announcements', icon: Bell },
    { name: 'Orari Mësimor', path: '/schedule', icon: Calendar },
    { name: 'Detyrat & Dorëzimet', path: '/assignments', icon: FileCheck2 },
    { name: 'Sallat', path: '/rooms', icon: Building },
    { name: 'Rezervimet', path: '/bookings', icon: BookmarkCheck }
  ];

  const adminItems = [
    { name: 'Përdoruesit', path: '/admin/users', icon: Users },
    { name: 'Statistika & Raporte', path: '/admin/stats', icon: BarChart3 }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight">SmartCampus</span>
              <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider flex items-center space-x-1">
                <span>Platformë Kursi</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Mbyll menynë"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kryesore
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div>
              <p className="px-3 text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-2">
                Administrim
              </p>
              <nav className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-600 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* User Card & Version in Footer (Kërkesa 8) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          {user && (
            <div className="flex items-center space-x-3 mb-3">
              <Avatar user={user} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {user.faculty || 'Universiteti'} {user.group ? `(${user.group})` : ''}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
            <span>SMARTCAMPUS v1.0.0</span>
            <span className="flex items-center space-x-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
