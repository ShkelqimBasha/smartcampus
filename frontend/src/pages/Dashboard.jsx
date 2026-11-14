import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  announcementsService,
  assignmentsService,
  bookingsService,
  schedulesService
} from '../services/api';
import { DAYS_FULL } from '../utils/constants';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Bell,
  FileText,
  BookmarkCheck,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  DoorOpen
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    announcements: 0,
    assignments: 0,
    bookings: 0
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data dinamike dhe përshëndetja sipas orës
  const today = new Date();
  const currentHour = today.getHours();
  let greeting = 'Mirëdita';
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Mirëmëngjes';
  } else if (currentHour >= 18 || currentHour < 5) {
    greeting = 'Mirëmbrëma';
  }

  // Formatimi i datës së sotme në shqip
  const dayName = DAYS_FULL[today.getDay()];
  const formattedDate = `${dayName}, ${today.toLocaleDateString('sq-AL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })}`;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [annRes, assRes, bookRes, schRes] = await Promise.all([
          announcementsService.getAll(),
          assignmentsService.getAll(),
          bookingsService.getAll(),
          schedulesService.getAll()
        ]);

        const announcements = annRes.data.announcements || [];
        const assignments = assRes.data.assignments || [];
        const bookings = bookRes.data.bookings || [];
        const schedules = schRes.data.schedules || [];

        setCounts({
          announcements: announcements.length,
          assignments: assignments.length,
          bookings: bookings.length
        });

        // 3 njoftimet më të fundit
        setRecentAnnouncements(announcements.slice(0, 3));

        // Orari i sotëm
        let dayIndex = today.getDay(); // 0 = e diel, 1 = e hënë...
        if (dayIndex === 0 || dayIndex === 6) dayIndex = 1;

        const currentDayClasses = schedules.filter((s) => s.dayOfWeek === dayIndex);
        setTodaySchedules(currentDayClasses.length > 0 ? currentDayClasses : schedules.slice(0, 3));

        // 3 detyrat me afat më të afërt
        const sortedAssignments = [...assignments]
          .filter((a) => new Date(a.deadline) > new Date())
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 3);

        setUpcomingAssignments(sortedAssignments);
      } catch (error) {
        console.error('Gabim në ngarkimin e të dhënave të panelit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDaysRemaining = (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' }
    }
  };

  return (
    <div className="space-y-6">
      {/* 3.1 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{formattedDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {greeting}, {user?.firstName} {user?.lastName}!
          </h1>

          <p className="mt-2 text-blue-100 text-xs sm:text-sm leading-relaxed">
            {user?.role === 'STUDENT'
              ? `Mirësevini në profilin tuaj studentor (${user?.faculty || 'Fakulteti'}, Grupi ${user?.group || 'FTI-1'}). Këtu mund të ndiqni orarin e sotëm, njoftimet e dekanatit dhe afatet e detyrave.`
              : user?.role === 'PROFESSOR'
              ? `Paneli juaj akademik për organizimin e lëndëve, publikimin e njoftimeve dhe vlerësimin e detyrave të studentëve.`
              : `Paneli qendror i administrimit të SMARTCAMPUS: menaxhimi i përdoruesve, miratimi i rezervimeve dhe raportet statistikore.`}
          </p>
        </div>
      </motion.div>

      {/* 3.2 3 Karta Statistikash me framer-motion */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* Karta 1: Njoftime (Blu) */}
        <motion.div variants={cardVariants} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/announcements"
            className="group block p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-blue-600 shadow-sm hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors flex items-center space-x-1">
                <span>Shiko</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Njoftime Zyrtare
              </h3>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : counts.announcements}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Karta 2: Detyra (Vjollcë) */}
        <motion.div variants={cardVariants} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/assignments"
            className="group block p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-purple-600 shadow-sm hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-colors flex items-center space-x-1">
                <span>Shiko</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Detyra Kursi
              </h3>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : counts.assignments}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Karta 3: Rezervime (Gjelbër) */}
        <motion.div variants={cardVariants} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/bookings"
            className="group block p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 border-l-emerald-600 shadow-sm hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 transition-colors flex items-center space-x-1">
                <span>Shiko</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Rezervime Sallash
              </h3>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : counts.bookings}
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* 3.3 Grid 2 Kolona: Orari i Sotëm & Afatet e Afërta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seksioni 1: Orari i Sotëm */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Orari i Sotëm
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {dayName} &bull; Leksione dhe Seminare
                  </p>
                </div>
              </div>
              <Link
                to="/schedule"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-0.5"
              >
                <span>Orari i plotë</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-2">
                <CardSkeleton />
              </div>
            ) : todaySchedules.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Nuk ka mësim sot"
                description="Nuk keni orë mësimore të planifikuara për këtë ditë."
              />
            ) : (
              <div className="space-y-3">
                {todaySchedules.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {item.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>
                          Salla:{' '}
                          <strong className="text-slate-700 dark:text-slate-300">
                            {item.room}
                          </strong>
                        </span>
                        <span>&bull;</span>
                        <span>
                          Grupi:{' '}
                          <strong className="text-slate-700 dark:text-slate-300">
                            {item.group}
                          </strong>
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex-shrink-0 border border-blue-100 dark:border-blue-900">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Seksioni 2: Afatet e Afërta */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Afatet e Afërta
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Detyrat që kërkojnë vëmendje
                  </p>
                </div>
              </div>
              <Link
                to="/assignments"
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center space-x-0.5"
              >
                <span>Të gjitha</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-2">
                <CardSkeleton />
              </div>
            ) : upcomingAssignments.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Nuk ka afate të afërta"
                description="Të gjitha detyrat janë dorëzuar ose nuk ka detyra me afat të afërt."
              />
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((ass) => {
                  const daysLeft = getDaysRemaining(ass.deadline);
                  const isUrgent = daysLeft <= 3;

                  return (
                    <Link
                      key={ass.id}
                      to={`/assignments/${ass.id}`}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors flex items-center justify-between block group"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {ass.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {ass.faculty} &bull; {ass.group}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
                          isUrgent
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse'
                            : daysLeft <= 7
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {daysLeft <= 0 ? 'Afati sot!' : `${daysLeft} ditë`}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Seksioni 3: Njoftimet e Fundit */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Njoftimet e Fundit
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Komunikata nga dekanati dhe stafi akademik
              </p>
            </div>
          </div>
          <Link
            to="/announcements"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-0.5"
          >
            <span>Shiko të gjitha</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : recentAnnouncements.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Nuk ka njoftime"
            description="Nuk ka njoftime të reja për momentin."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAnnouncements.map((ann) => (
              <motion.div
                key={ann.id}
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ann.target === 'ALL'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : ann.target === 'FACULTY'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {ann.target === 'ALL'
                        ? 'Të Gjithë'
                        : ann.target === 'FACULTY'
                        ? ann.faculty
                        : ann.group}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(ann.createdAt).toLocaleDateString('sq-AL')}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>
                    {ann.author?.firstName} {ann.author?.lastName}
                  </span>
                  <Link
                    to="/announcements"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Lexo &rarr;
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
