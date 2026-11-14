import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { assignmentsService } from '../services/api';
import { STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Clock,
  ArrowRight,
  Trash2,
  X,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const Assignments = () => {
  const { user, isAdmin, isProfessor } = useAuth();
  const { showToast } = useToast();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    faculty: user?.faculty || 'Fakulteti i Teknologjisë së Informacionit',
    group: user?.group || 'FTI-1'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await assignmentsService.getAll();
      setAssignments(res.data.assignments || []);
    } catch (error) {
      console.error(error);
      showToast('Dështoi ngarkimi i detyrave.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni të sigurt që dëshironi të fshini këtë detyrë?')) return;
    try {
      await assignmentsService.delete(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      showToast('Detyra u fshi me sukses!', 'success');
    } catch (error) {
      showToast('Dështoi fshirja e detyrës.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await assignmentsService.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        deadline: '',
        faculty: user?.faculty || '',
        group: user?.group || ''
      });
      showToast('Detyra u krijua me sukses!', 'success');
      fetchAssignments();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Dështoi krijimi i detyrës.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysRemaining = (deadline) => {
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PENDING') {
      return !a.mySubmission && new Date(a.deadline) > new Date();
    }
    if (filterStatus === 'SUBMITTED') {
      return a.mySubmission && a.mySubmission.status !== 'GRADED';
    }
    if (filterStatus === 'GRADED') {
      return a.mySubmission && a.mySubmission.status === 'GRADED';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Detyrat e Kursit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Menaxhimi i projekteve, afateve dhe dorëzimeve studentore
          </p>
        </div>

        {(isAdmin || isProfessor) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Krijo Detyrë</span>
          </motion.button>
        )}
      </div>

      {/* Filter Tabs */}
      {user?.role === 'STUDENT' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'Të Gjitha' },
            { id: 'PENDING', label: 'Pa dorëzuar' },
            { id: 'SUBMITTED', label: 'Të Dorëzuara' },
            { id: 'GRADED', label: 'Të Vlerësuara' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Assignments Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nuk ka detyra në këtë kategori"
          description="Nuk u gjet asnjë detyrë aktive për filtrin e zgjedhur."
          actionLabel={isAdmin || isProfessor ? 'Krijo Detyrë të Re' : null}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAssignments.map((assignment, idx) => {
            const deadlineDate = new Date(assignment.deadline);
            const isPast = new Date() > deadlineDate;
            const daysLeft = getDaysRemaining(assignment.deadline);
            const mySub = assignment.mySubmission;

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {assignment.faculty} &bull; {assignment.group}
                    </span>

                    {/* Badge Statusi */}
                    {user?.role === 'STUDENT' ? (
                      <span
                        className={`text-xs px-2.5 py-1 font-bold rounded-full border ${
                          mySub
                            ? STATUS_COLORS[mySub.status] || 'bg-slate-100 dark:bg-slate-800'
                            : isPast
                            ? STATUS_COLORS['MISSING']
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {mySub
                          ? STATUS_LABELS[mySub.status] || mySub.status
                          : isPast
                          ? 'Mungon'
                          : 'Pa dorëzuar'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                        {assignment.submissionsCount} Dorëzime
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {assignment.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {assignment.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Afati:{' '}
                          <strong className={isPast ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}>
                            {deadlineDate.toLocaleDateString('sq-AL', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </strong>
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isPast
                            ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                            : daysLeft <= 3
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-extrabold animate-pulse'
                            : daysLeft <= 7
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {isPast ? 'Afati ka kaluar' : `${daysLeft} ditë të mbetura`}
                      </span>
                    </div>

                    <p>
                      Pedagogu:{' '}
                      <strong className="text-slate-700 dark:text-slate-300">
                        {assignment.professor?.firstName} {assignment.professor?.lastName}
                      </strong>
                    </p>

                    {mySub && mySub.grade !== null && mySub.grade !== undefined && (
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between">
                        <span>Nota e vlerësuar:</span>
                        <span className="text-sm">{mySub.grade} / 100</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {(isAdmin || (isProfessor && assignment.professorId === user?.id)) && (
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      title="Fshi detyrën"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <Link
                    to={`/assignments/${assignment.id}`}
                    className="ml-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs transition-colors"
                  >
                    <span>{user?.role === 'STUDENT' ? 'Dorëzo / Shiko' : 'Shiko Dorëzimet'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Krijimi i Detyrës */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Krijo Detyrë të Re Kursi</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Titulli i Detyrës
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="p.sh. Detyrë Kursi: Arkitektura e Aplikacionit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Grupi Studentor
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    placeholder="FTI-1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Afati i Dorëzimit
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Përshkrimi dhe Kërkesat
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Përshkruani detyrën, formatin e kërkuar dhe mënyrën e vlerësimit..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Duke krijuar...' : 'Krijo Detyrën'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
