import React, { useState, useEffect } from 'react';
import { statsService } from '../services/api';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { CardSkeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';
import {
  Users,
  Bell,
  FileText,
  BookmarkCheck,
  DoorOpen,
  GraduationCap,
  TrendingUp,
  Activity
} from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await statsService.getStats();
        setStats(res.data.stats);
      } catch (error) {
        console.error('Gabim në ngarkimin e statistikave:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
        <p>Statistikat nuk janë të disponueshme për momentin.</p>
      </div>
    );
  }

  // 1. Përdoruesit sipas Rolit (Doughnut)
  const usersChartData = {
    labels: ['Studentë', 'Pedagogë', 'Administratorë'],
    datasets: [
      {
        data: [
          stats.users?.students || 0,
          stats.users?.professors || 0,
          stats.users?.admins || 0
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#a855f7'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  };

  // 2. Rezervimet sipas Sallave (Bar Chart)
  const roomsLabels = stats.rooms?.byRoom?.map((r) => `Salla ${r.name}`) || [];
  const roomsData = stats.rooms?.byRoom?.map((r) => r.count) || [];

  const bookingsChartData = {
    labels: roomsLabels.length > 0 ? roomsLabels : ['Nuk ka të dhëna'],
    datasets: [
      {
        label: 'Numri i Rezervimeve',
        data: roomsData.length > 0 ? roomsData : [0],
        backgroundColor: '#3b82f6',
        borderRadius: 8
      }
    ]
  };

  // 3. Statusi i Dorëzimit të Detyrave (Doughnut)
  const assignmentsChartData = {
    labels: ['Të Vlerësuara', 'Në Pritje', 'Me Vonesë'],
    datasets: [
      {
        data: [
          stats.assignments?.graded || 0,
          stats.assignments?.submitted || 0,
          stats.assignments?.late || 0
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2
      }
    ]
  };

  // 4. Aktiviteti Mujor i Platformës (Line Chart)
  const monthlyActivityData = {
    labels: ['Tetor', 'Nëntor', 'Dhjetor', 'Janar', 'Shkurt', 'Mars'],
    datasets: [
      {
        label: 'Aktivitet & Ndërveprime',
        data: [15, 34, 42, 28, 55, 68],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#6366f1'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Statistika & Raporte
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pamje e përgjithshme analitike mbi përdoruesit, detyrat dhe përdorimin e sallave
        </p>
      </div>

      {/* 5 Karta Statistikash në Krye */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Karta 1: Përdorues */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Përdorues
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.users?.total}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Karta 2: Detyra */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Detyra
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.assignments?.total}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Karta 3: Rezervime */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Rezervime
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.rooms?.bookings?.total}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Karta 4: Njoftime */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Njoftime
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.announcements?.total || 5}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Karta 5: Salla */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition col-span-2 lg:col-span-1"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                Salla
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.rooms?.total}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grafikët (Grid 2 Kolona) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik 1: Përdoruesit sipas Rolit (Doughnut) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Përdoruesit sipas Rolit</span>
          </h3>
          <div className="max-w-[240px] mx-auto py-3">
            <Doughnut
              data={usersChartData}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 text-center text-xs">
            <div>
              <p className="font-extrabold text-emerald-600">{stats.users?.students}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Studentë</p>
            </div>
            <div>
              <p className="font-extrabold text-blue-600">{stats.users?.professors}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Pedagogë</p>
            </div>
            <div>
              <p className="font-extrabold text-purple-600">{stats.users?.admins}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Administratorë</p>
            </div>
          </div>
        </motion.div>

        {/* Grafik 2: Statusi i Dorëzimeve të Detyrave (Doughnut) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Statusi i Dorëzimeve të Detyrave</span>
          </h3>
          <div className="max-w-[240px] mx-auto py-3">
            <Doughnut
              data={assignmentsChartData}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 text-center text-xs">
            <div>
              <p className="font-extrabold text-emerald-600">{stats.assignments?.graded}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Të Vlerësuara</p>
            </div>
            <div>
              <p className="font-extrabold text-blue-600">{stats.assignments?.submitted}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Në Pritje</p>
            </div>
            <div>
              <p className="font-extrabold text-amber-600">{stats.assignments?.late}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[11px]">Me Vonesë</p>
            </div>
          </div>
        </motion.div>

        {/* Grafik 3: Rezervimet sipas Sallave (Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <DoorOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Përdorimi i Sallave (Rezervime sipas Sallës)</span>
          </h3>
          <div className="h-60">
            <Bar
              data={bookingsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Grafik 4: Aktiviteti Mujor (Line Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Aktiviteti Mujor në Platformë</span>
          </h3>
          <div className="h-60">
            <Line
              data={monthlyActivityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminStats;
