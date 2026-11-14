import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';
import { ROLE_LABELS } from '../utils/constants';
import {
  Menu,
  LogOut,
  Search,
  GraduationCap,
  ChevronDown,
  Building,
  Users,
  Mail,
  Sun,
  Moon
} from 'lucide-react';

const roleBadgeColors = {
  ADMIN: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800',
  PROFESSOR: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  STUDENT: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800'
};

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Mbyllja e dropdown-it kur klikohet jashtë
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/announcements?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-sm transition-colors duration-200">
      {/* Pjesa e majtë: Hamburger dhe Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Hap menynë"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
            SMARTCAMPUS
          </span>
        </Link>
      </div>

      {/* Pjesa qendrore: Global Search (Kërkesa 6.5) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <form onSubmit={handleGlobalSearch} className="w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kërko njoftime, detyra..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 text-xs border border-transparent focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400"
          />
        </form>
      </div>

      {/* Pjesa e djathtë: Dark Mode Toggle, Avatar dhe Dropdown i Profilit */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Buton Dark Mode Toggle (Kërkesa 6.6) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Kalo në modalitetin e ditës (Light)' : 'Kalo në modalitetin e natës (Dark)'}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-none"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <Avatar user={user} size="sm" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-slate-400">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu i Detajuar i Profilit */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
                  <Avatar user={user} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center space-x-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2 text-xs border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Roli:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full border ${
                        roleBadgeColors[user.role] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </div>

                  {user.faculty && (
                    <div className="flex items-start space-x-1 text-slate-600 dark:text-slate-300">
                      <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{user.faculty}</span>
                    </div>
                  )}

                  {user.group && (
                    <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Grupi: {user.group}</span>
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Dil nga platforma</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={logout}
          title="Dil nga llogaria"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 hover:border-red-200 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Dil</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
