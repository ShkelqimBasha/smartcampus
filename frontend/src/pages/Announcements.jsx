import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { announcementsService } from '../services/api';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Bell,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Eye,
  Filter,
  X,
  Sparkles
} from 'lucide-react';

const Announcements = () => {
  const { user, isAdmin, isProfessor } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetFilter, setTargetFilter] = useState('ALL_TYPES');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'ALL',
    faculty: user?.faculty || 'Fakulteti i Teknologjisë së Informacionit',
    group: user?.group || 'FTI-1'
  });
  const [submitting, setSubmitting] = useState(false);

  // Lexo query parameter nga URL nëse vjen nga kërkimi global
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementsService.getAll();
      setAnnouncements(res.data.announcements || []);
    } catch (error) {
      console.error(error);
      showToast('Dështoi ngarkimi i njoftimeve.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await announcementsService.markAsRead(id);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
      showToast('Njoftimi u shënua si i lexuar.', 'success');
    } catch (error) {
      showToast('Dështoi shënimi i njoftimit.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni të sigurt që dëshironi të fshini këtë njoftim?')) return;
    try {
      await announcementsService.delete(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showToast('Njoftimi u fshi me sukses!', 'success');
    } catch (error) {
      showToast('Dështoi fshirja e njoftimit.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await announcementsService.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        target: 'ALL',
        faculty: user?.faculty || '',
        group: user?.group || ''
      });
      showToast('Njoftimi u publikua me sukses!', 'success');
      fetchAnnouncements();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Dështoi publikimi i njoftimit.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTarget =
      targetFilter === 'ALL_TYPES' || item.target === targetFilter;
    return matchesSearch && matchesTarget;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Njoftimet Zyrtare</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Komunikata nga dekanati, departamentet dhe stafi pedagogjik
          </p>
        </div>

        {(isAdmin || isProfessor) && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Krijo Njoftim</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar (Kërkesa 5.2) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Kërko njoftime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Target Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setTargetFilter('ALL_TYPES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              targetFilter === 'ALL_TYPES'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Të Gjitha
          </button>
          <button
            onClick={() => setTargetFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              targetFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Gjithë Universiteti
          </button>
          <button
            onClick={() => setTargetFilter('FACULTY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              targetFilter === 'FACULTY'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Fakulteti
          </button>
          <button
            onClick={() => setTargetFilter('GROUP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              targetFilter === 'GROUP'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Grupi
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nuk u gjet asnjë njoftim"
          description="Nuk ka njoftime që përputhen me kriteret e kërkimit ose filtrat e zgjedhur."
          actionLabel={(isAdmin || isProfessor) ? "Krijo Njoftim" : null}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-xl border bg-white shadow transition-all duration-200 ${
                ann.isRead
                  ? 'border-slate-200'
                  : 'border-blue-300 ring-1 ring-blue-500/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ann.target === 'ALL'
                          ? 'bg-blue-100 text-blue-800'
                          : ann.target === 'FACULTY'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ann.target === 'ALL'
                        ? 'Gjithë Universiteti'
                        : ann.target === 'FACULTY'
                        ? `Fakulteti: ${ann.faculty}`
                        : `Grupi: ${ann.group}`}
                    </span>

                    {/* Badge "I ri" për njoftimet e palexuara (Kërkesa 5.2) */}
                    {user?.role === 'STUDENT' && !ann.isRead && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>I ri</span>
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString('sq-AL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{ann.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {ann.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Publikuar nga:{' '}
                      <strong className="text-slate-700">
                        {ann.author?.firstName} {ann.author?.lastName}
                      </strong>{' '}
                      ({ann.author?.role})
                    </span>

                    <div className="flex items-center space-x-2">
                      {user?.role === 'STUDENT' && !ann.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(ann.id)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Shëno si të lexuar</span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(ann.id)}
                          title="Fshi njoftimin"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Krijimi me Backdrop (Kërkesa 5.2) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Publiko Njoftim të Ri</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Titulli i Njoftimit
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="p.sh. Njoftim për ndryshim orari"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Niveli i Targetimit
                </label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="ALL">Gjithë Universiteti (ALL)</option>
                  <option value="FACULTY">Fakultet i Caktuar</option>
                  <option value="GROUP">Grup i Caktuar</option>
                </select>
              </div>

              {formData.target === 'FACULTY' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Emri i Fakultetit
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    placeholder="p.sh. Fakulteti i Teknologjisë së Informacionit"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {formData.target === 'GROUP' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grupi Studentor
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    placeholder="p.sh. FTI-1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Përmbajtja e Njoftimit
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Shkruani tekstin e plotë të njoftimit këtu..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Duke publikuar...' : 'Publiko Njoftimin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
