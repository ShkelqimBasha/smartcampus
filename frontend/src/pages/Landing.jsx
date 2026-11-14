import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  ShieldCheck,
  BookOpen,
  Users
} from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                SMART<span className="text-blue-600">CAMPUS</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                v1.0 Live
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
              >
                <span>Hyr te Paneli</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kyçu</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Regjistrohu</span>
                </Link>
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
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Sistemi Universitar i Gjeneratës së Re 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
            SMART<span className="text-blue-300">CAMPUS</span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-blue-100 mb-6 max-w-2xl mx-auto">
            Platformë e Integruar Universitare
          </p>

          <p className="text-base sm:text-lg text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Një hapësirë e vetme dixhitale për studentët, pedagogët dhe administratën. 
            Menaxhoni oraret javore, njoftimet e targetuara, detyrat e kursit dhe rezervimet e sallave në kohë reale.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-base bg-white text-blue-900 hover:bg-blue-50 shadow-xl shadow-black/20 hover:scale-105 transition-all duration-150"
            >
              <span>Hyr në Platformë</span>
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-base bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all duration-150"
            >
              <UserPlus className="w-5 h-5" />
              <span>Regjistrohu</span>
            </Link>
          </div>

          {/* Quick Info Badges */}
          <div className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto text-xs text-blue-100/90 font-medium">
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
          </div>
        </div>
      </section>

      {/* Features Section (3 Cards) */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-black uppercase tracking-wider text-blue-600 mb-2">
              Modulet Kryesore
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Gjithçka që ju nevojitet në një platformë të vetme
            </p>
            <p className="mt-3 text-slate-600 text-sm">
              Projektuar posaçërisht për të lehtësuar rrjedhën e informacionit dhe procesin mësimor në universitet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Njoftime */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                  <Bell className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Njoftime & Komunikim
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Qëndroni gjithnjë të përditësuar me njoftime zyrtare të targetuara sipas nivelit: për të gjithë universitetin, sipas fakultetit ose posaçërisht për grupin tuaj mësimor.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Targetim: ALL, FACULTY, GROUP</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Shënues automatik "E Lexuar"</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Filtra dhe kërkim i shpejtë</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Orari & Detyra */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 border border-indigo-100 shadow-sm">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Orari & Detyrat e Kursit
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Planifikim i saktë i orarit mësimor të ndarë sipas ditëve të javës. Ngarkim i punimeve të studentëve, ndjekje e afateve dhe vlerësim me notë e komente nga pedagogu.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Tab-e javore: E Hënë - E Premte</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Ngarkim skedarësh (PDF, ZIP, DOCX)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>Llogaritje automatike e dorëzimeve LATE</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Rezervime Sallash */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 border border-purple-100 shadow-sm">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Rezervime Sallash
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Katalogu i plotë i sallave të leksionit, laboratorëve dhe amfiteatrove. Rezervim i lehtë me sistem parandalimi në kohë reale të mbivendosjes së orareve.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Parandalim i menjëhershëm i konflikteve</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Kapaciteti & lista e pajisjeve për çdo sallë</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span>Miratim ose refuzim nga administratorët</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-800">SMARTCAMPUS</span>
            <span>— Platformë e Integruar Universitare</span>
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

