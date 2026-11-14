import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  ArrowRight,
  UserPlus,
  LogIn,
  Bell,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const featureCards = [
    {
      title: 'Njoftime & Komunikim',
      desc: 'Qëndroni gjithnjë të përditësuar me njoftime zyrtare të targetuara sipas nivelit: për të gjithë universitetin, sipas fakultetit ose posaçërisht për grupin tuaj mësimor.',
      icon: Bell,
      color: 'blue',
      badge: 'Targetim ALL, FACULTY, GROUP',
      points: [
        'Filtrim inteligjent sipas departamenteve',
        'Shënues automatik "E Lexuar" në kohë reale',
        'Arkiv i kërkueshëm me kërkim të menjëhershëm'
      ]
    },
    {
      title: 'Orari & Detyrat e Kursit',
      desc: 'Planifikim i saktë i orarit mësimor të ndarë sipas ditëve të javës. Ngarkim i punimeve të studentëve, ndjekje e afateve dhe vlerësim me notë e komente nga pedagogu.',
      icon: Calendar,
      color: 'indigo',
      badge: 'Tab-e Ditore E Hënë - E Premte',
      points: [
        'Orari javor i personalizuar për çdo grup',
        'Ngarkim dokumentesh (PDF, ZIP, DOCX)',
        'Llogaritje automatike e dorëzimeve me vonesë'
      ]
    },
    {
      title: 'Rezervime Sallash',
      desc: 'Katalogu i plotë i sallave të leksionit, laboratorëve dhe amfiteatrove. Rezervim i lehtë me sistem parandalimi në kohë reale të mbivendosjes së orareve.',
      icon: Building2,
      color: 'purple',
      badge: 'Parandalim Konfliktesh',
      points: [
        'Kontroll automatik i disponueshmërisë',
        'Pajisjet & kapaciteti i çdo ambienti',
        'Menaxhim statusesh: Pending, Approved, Rejected'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                SMART<span className="text-blue-600 dark:text-blue-400">CAMPUS</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                v1.0 Live
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Kalo në modalitetin e ditës' : 'Kalo në modalitetin e natës'}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-800/60 active:scale-95 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {user ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all"
                >
                  <span>Hyr te Paneli</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kyçu</span>
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Regjistrohu</span>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 text-white py-20 lg:py-28">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-semibold mb-6 shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Sistemi Universitar i Gjeneratës së Re 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4"
          >
            SMART<span className="text-blue-300">CAMPUS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl font-semibold text-blue-100 mb-6 max-w-2xl mx-auto"
          >
            Platforma e Integruar Universitare
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg text-blue-100/85 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Një hapësirë e vetme dixhitale për studentët, pedagogët dhe administratën. 
            Menaxhoni oraret javore, njoftimet e targetuara, detyrat e kursit dhe rezervimet e sallave në kohë reale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-base bg-white text-blue-900 hover:bg-blue-50 shadow-xl shadow-black/25 transition-all"
              >
                <span>Hyr në Platformë</span>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-base bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all"
              >
                <UserPlus className="w-5 h-5" />
                <span>Regjistrohu</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Info Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto text-xs text-blue-100/90 font-medium"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3 Role të Personalizuara</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Orar Interaktiv Javor</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rezervim pa Konflikte</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1-Click Demo Login</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section (3 Cards) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Modulet Kryesore
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Gjithçka që ju nevojitet në një platformë të vetme
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
              Projektuar posaçërisht për të lehtësuar rrjedhën e informacionit dhe procesin mësimor në universitet.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800 shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {card.desc}
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800 font-medium">
                    {card.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200">SMARTCAMPUS</span>
            <span>— Platforma e Integruar Universitare</span>
          </div>
          <div>
            © 2026 Shkëlqim Basha | Projekt Kursi në "Hartim dhe Menaxhim Projektesh"
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
