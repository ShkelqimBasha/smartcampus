import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail, loginPassword) => {
    setError('');
    setLoading(true);

    try {
      await login(loginEmail, loginPassword);
      showToast('Mirësevini! Kyçja u krye me sukses.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Kredenciale të pasakta. Ju lutem kontrolloni të dhënat.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  // Funksion për Quick Login me 1 klik (Kërkesa 4)
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
    handleLogin(demoEmail, demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl mb-4">
          <GraduationCap className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SMARTCAMPUS
        </h1>
        <p className="mt-1 text-sm text-blue-100/90 font-medium">
          Platformë e Integruar Universitare
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">
            Kyçuni në Platformë
          </h2>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@smartcampus.al"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Fjalëkalimi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all duration-150 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Duke u kyçur...</span>
              ) : (
                <>
                  <span>Hyr në platformë</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Buttons (Kërkesa 4) */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Kyçje e Shpejtë me 1 Klik (Demo)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                disabled={loading}
                className="py-2 px-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100/80 transition-all text-center flex flex-col items-center justify-center space-y-1"
              >
                <span className="text-base">👨‍🎓</span>
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('pedagog')}
                disabled={loading}
                className="py-2 px-2 text-xs font-semibold rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100/80 transition-all text-center flex flex-col items-center justify-center space-y-1"
              >
                <span className="text-base">👨‍🏫</span>
                <span>Pedagog</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={loading}
                className="py-2 px-2 text-xs font-semibold rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100/80 transition-all text-center flex flex-col items-center justify-center space-y-1"
              >
                <span className="text-base">🔧</span>
                <span>Admin</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Fjalëkalimi i të gjithë përdoruesve: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">demo123</code>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Nuk keni ende llogari?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
                Regjistrohu këtu
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
