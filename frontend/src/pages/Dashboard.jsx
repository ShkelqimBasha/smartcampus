import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  announcementsService,
  assignmentsService,
  bookingsService,
  schedulesService
} from '../services/api';
import { DAYS_FULL, ROLE_LABELS } from '../utils/constants';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Bell,
  FileCheck2,
  BookmarkCheck,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  Building,
  Sparkles,
  BookOpen,
  ChevronRight,
  CheckCircle2
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

  // Data dinamike dhe përshëndetja sipas orës (Kërkesa 3.1)
  const today = new Date();
  const currentHour = today.getHours();
  let greeting = 'Mirëdita';
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Mirëmëngjes';
  } else if (currentHour >= 18 || currentHour < 5) {
    greeting = 'Mirëmbrëma';
  }

  // Formatimi i datës së sotme në shqip (p.sh. "E Enjte, 12 Nëntor 2026")
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

        // Orari i sotëm (nëse dita është e shtunë/e diel, shfaq orarin e ditës së hënë ose më të afërt)
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

  // Llogaritja e ditëve të mbetura për detyrat
  const getDaysRemaining = (deadline) => {
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* 3.1 Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{formattedDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
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
      </div>

      {/* 3.2 3 Karta Statistikash (klikueshme, me border-l-4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Karta 1: Njoftime (Blu) */}
        <Link
          to="/announcements"
          className="group p-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-blue-600 shadow hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors flex items-center space-x-1">
              <span>Shiko</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Njoftime Zyrtare
            </h3>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : counts.announcements}
            </p>
          </div>
        </Link>

        {/* Karta 2: Detyra (Vjollcë) */}
        <Link
          to="/assignments"
          className="group p-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-purple-600 shadow hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 group-hover:bg-purple-100 transition-colors flex items-center space-x-1">
              <span>Shiko</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Detyra Kursi
            </h3>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : counts.assignments}
            </p>
          </div>
        </Link>

        {/* Karta 3: Rezervime (Gjelbër) */}
        <Link
          to="/bookings"
          className="group p-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-emerald-600 shadow hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors flex items-center space-x-1">
              <span>Shiko</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rezervime Sallash
            </h3>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {loading ? '...' : counts.bookings}
            </p>
          </div>
        </Link>
      </div>

      {/* 3.3 Seksionet e Reja: Grid 2 Kolona (lg:grid-cols-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seksioni 1: Orari i Sotëm */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow hover:shadow-lg transition duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">📅 Orari i Sotëm</h3>
                  <p className="text-[11px] text-slate-400">{dayName} &bull; Leksione dhe Seminare</p>
                </div>
              </div>
              <Link to="/schedule" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5">
                <span>Orari i plotë</span>
                <ChevronRight className="w-3.5 h-3.5" />
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
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{item.subject}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span>Salla: <strong className="text-slate-700">{item.room}</strong></span>
                        <span>&bull;</span>
                        <span>Grupi: <strong className="text-slate-700">{item.group}</strong></span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex-shrink-0 border border-blue-100">
                      <Clock className="w-3 h-3" />
                      <span>{item.startTime} - {item.endTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seksioni 2: Afatet e Afërta (⏰ Afatet e afërta) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow hover:shadow-lg transition duration-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">⏰ Afatet e Afërta</h3>
                  <p className="text-[11px] text-slate-400">Detyrat që kërkojnë vëmendje</p>
                </div>
              </div>
              <Link to="/assignments" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-0.5">
                <span>Të gjitha</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-2">
                <CardSkeleton />
              </div>
            ) : upcomingAssignments.length === 0 ? (
              <EmptyState
                icon={FileCheck2}
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
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between block group"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                          {ass.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ass.faculty} &bull; {ass.group}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
                          isUrgent
                            ? 'bg-red-100 text-red-700 border-red-200 animate-pulse'
                            : daysLeft <= 7
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        {daysLeft <= 0 ? 'Afati sot!' : `${daysLeft} ditë të mbetura`}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seksioni 3: Njoftimet e Fundit (Full Width ose Grid) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow hover:shadow-lg transition duration-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">📢 Njoftimet e Fundit</h3>
              <p className="text-[11px] text-slate-400">Komunikata nga dekanati dhe stafi akademik</p>
            </div>
          </div>
          <Link to="/announcements" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5">
            <span>Shiko të gjitha →</span>
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
              <div
                key={ann.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ann.target === 'ALL'
                          ? 'bg-blue-100 text-blue-800'
                          : ann.target === 'FACULTY'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ann.target === 'ALL' ? 'Të Gjithë' : ann.target === 'FACULTY' ? ann.faculty : ann.group}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString('sq-AL')}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{ann.author?.firstName} {ann.author?.lastName}</span>
                  <Link to="/announcements" className="font-semibold text-blue-600 hover:underline">
                    Lexo &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
