import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Shield,
  BookOpen,
  Loader2,
  ChevronLeft
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail, loginPassword, demoRole = null) => {
    setError('');
    setLoading(true);
    setActiveDemo(demoRole);

    try {
      await login(loginEmail, loginPassword);
      showToast('Mirësevini! Kyçja u krye me sukses.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Gabim gjatë kyçjes:', err);

      // Nëse nuk ka përgjigje nga serveri ose është error serveri 5xx/Network
      if (!err.response || err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        setError('Nuk mund të lidhem me serverin. Ju lutem prisni 30 sekonda dhe provoni përsëri.');
      } else if (err.response?.status === 401 || err.response?.status === 400) {
        setError(err.response?.data?.message || 'Kredenciale të pasakta. Ju lutem kontrolloni email-in dhe fjalëkalimin.');
      } else {
        setError('Nuk mund të lidhem me serverin. Ju lutem prisni 30 sekonda dhe provoni përsëri.');
      }
    } finally {
      setLoading(false);
      setActiveDemo(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  // Funksion për Quick Login me 1 klik
  const handleQuickLogin = (role) => {
    let demoEmail = '';
    const demoPassword = 'demo123';

    if (role === 'student') {
      demoEmail = 'student@smartcampus.al';
    } else if (role === 'pedagog') {
      demoEmail = 'pedagog@smartcampus.al';
    } else if (role === 'admin') {
      demoEmail = 'admin@smartcampus.al';
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLogin(demoEmail, demoPassword, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Home Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 mb-4 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kthehu te Faqja Kryesore</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl mb-4">
          <GraduationCap className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SMARTCAMPUS
        </h1>
        <p className="mt-1 text-sm text-blue-100/90 font-medium">
          Platforma e Integruar Universitare
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
            Kyçuni në Platformë
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-start space-x-3 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@smartcampus.al"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:opacity-75"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Fjalëkalimi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:opacity-75"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading && !activeDemo ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Duke u kyçur...</span>
                </>
              ) : (
                <>
                  <span>Hyr në platformë</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Login Buttons (Demo) */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center mb-3">
              Kyçje e Shpejtë me 1 Klik (Demo)
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Student (Blu) */}
              <motion.button
                type="button"
                onClick={() => handleQuickLogin('student')}
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className="py-2.5 px-2 text-xs font-bold rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/70 dark:from-blue-950/60 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-all text-center flex flex-col items-center justify-center space-y-1 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
              >
                {loading && activeDemo === 'student' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400 my-0.5" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[12px] font-bold">Student</span>
                <span className="text-[9px] font-medium text-blue-500 dark:text-blue-400">demo</span>
              </motion.button>

              {/* Pedagog (Vjollcë) */}
              <motion.button
                type="button"
                onClick={() => handleQuickLogin('pedagog')}
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className="py-2.5 px-2 text-xs font-bold rounded-xl bg-gradient-to-b from-purple-50 to-purple-100/70 dark:from-purple-950/60 dark:to-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:border-purple-400 transition-all text-center flex flex-col items-center justify-center space-y-1 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
              >
                {loading && activeDemo === 'pedagog' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600 dark:text-purple-400 my-0.5" />
                ) : (
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[12px] font-bold">Pedagog</span>
                <span className="text-[9px] font-medium text-purple-500 dark:text-purple-400">demo</span>
              </motion.button>

              {/* Admin (E Kuqe) */}
              <motion.button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className="py-2.5 px-2 text-xs font-bold rounded-xl bg-gradient-to-b from-red-50 to-red-100/70 dark:from-red-950/60 dark:to-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:border-red-400 transition-all text-center flex flex-col items-center justify-center space-y-1 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
              >
                {loading && activeDemo === 'admin' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-red-600 dark:text-red-400 my-0.5" />
                ) : (
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[12px] font-bold">Admin</span>
                <span className="text-[9px] font-medium text-red-500 dark:text-red-400">demo</span>
              </motion.button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-3">
              Fjalëkalimi i përbashkët:{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-700 dark:text-slate-300 font-semibold">
                demo123
              </code>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nuk keni ende llogari?{' '}
              <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Regjistrohu këtu
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
