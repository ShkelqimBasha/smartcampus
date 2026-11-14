import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { assignmentsService, submissionsService } from '../services/api';
import { STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import { CardSkeleton, TableRowSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  FileCheck2,
  Calendar,
  Clock,
  Upload,
  File,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Award,
  MessageSquare,
  X
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const AssignmentDetail = () => {
  const { id } = useParams();
  const { user, isStudent, isProfessor, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Student Submission Form
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Professor Grading Modal
  const [gradingModal, setGradingModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gradingLoading, setGradingLoading] = useState(false);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const res = await assignmentsService.getById(id);
      setAssignment(res.data.assignment);
    } catch (error) {
      console.error(error);
      showToast('Dështoi ngarkimi i detajeve të detyrës.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!file && !content.trim()) {
      showToast('Ju lutem ngarkoni një skedar ose shkruani përmbajtjen e detyrës.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (content) formData.append('content', content);

      const res = await submissionsService.submit(id, formData);
      showToast(res.data.message || 'Detyra u dorëzua me sukses!', 'success');
      setFile(null);
      setContent('');
      fetchAssignment();
    } catch (error) {
      showToast(error.response?.data?.message || 'Dështoi dorëzimi i detyrës.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenGradeModal = (sub) => {
    setSelectedSub(sub);
    setGrade(sub.grade !== null && sub.grade !== undefined ? sub.grade.toString() : '');
    setFeedback(sub.feedback || '');
    setGradingModal(true);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    setGradingLoading(true);
    try {
      await submissionsService.grade(selectedSub.id, {
        grade: parseFloat(grade),
        feedback
      });
      setGradingModal(false);
      showToast('Vlerësimi u ruajt me sukses!', 'success');
      fetchAssignment();
    } catch (error) {
      showToast(error.response?.data?.message || 'Dështoi ruajtja e notës.', 'error');
    } finally {
      setGradingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!assignment) {
    return (
      <EmptyState
        icon={FileCheck2}
        title="Detyra nuk u gjet"
        description="Detyra e kërkuar nuk ekziston ose është fshirë."
        actionLabel="Kthehu te detyrat"
        onAction={() => window.history.back()}
      />
    );
  }

  const deadlineDate = new Date(assignment.deadline);
  const isPast = new Date() > deadlineDate;
  const mySub = isStudent && assignment.submissions?.length > 0 ? assignment.submissions[0] : null;

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div>
        <Link
          to="/assignments"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kthehu te lista e detyrave</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{assignment.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fakulteti: {assignment.faculty} &bull; Grupi: {assignment.group}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>
              Afati: <strong className={isPast ? 'text-red-600' : 'text-slate-900'}>
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
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Udhëzimet e Detyrës
        </h3>
        <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
          {assignment.description}
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          Pedagogu i lëndës:{' '}
          <strong className="text-slate-800">
            {assignment.professor?.firstName} {assignment.professor?.lastName}
          </strong>{' '}
          ({assignment.professor?.email})
        </div>
      </div>

      {/* STUDENT SECTION: Submit or View My Submission */}
      {isStudent && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Dorëzimi Juaj</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mySub ? 'Ju e keni dorëzuar këtë detyrë. Mund ta përditësoni përpara afatit.' : 'Ngarkoni skedarin ose shkruani përmbajtjen për dorëzim.'}
            </p>
          </div>

          {/* Current Submission Info if exists */}
          {mySub && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-xs px-2.5 py-1 font-bold rounded-full border ${STATUS_COLORS[mySub.status] || 'bg-slate-100'}`}>
                  {STATUS_LABELS[mySub.status] || mySub.status}
                </span>
                <span className="text-xs text-slate-500">
                  Dorëzuar më: {new Date(mySub.submittedAt).toLocaleString('sq-AL')}
                </span>
              </div>

              {mySub.fileUrl && (
                <div className="flex items-center space-x-2 text-xs">
                  <File className="w-4 h-4 text-blue-600" />
                  <a
                    href={`${SERVER_BASE_URL}${mySub.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>Shkarko skedarin e dorëzuar</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {mySub.content && (
                <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-line">
                  {mySub.content}
                </p>
              )}

              {/* Feedback and Grade */}
              {mySub.grade !== null && mySub.grade !== undefined && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center space-x-2 font-bold text-emerald-800 text-sm">
                    <Award className="w-4 h-4" />
                    <span>Nota Përfundimtare: {mySub.grade} / 100</span>
                  </div>
                  {mySub.feedback && (
                    <p className="mt-1 text-emerald-700">
                      <strong>Koment i pedagogut:</strong> {mySub.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit/Resubmit Form */}
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Ngarko Skedar (PDF, Word, ZIP, etj.)
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">Pranohen: .pdf, .docx, .zip, .rar (deri në 15MB)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Komente ose Përmbajtje Tekstuale (Opsionale)
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Shkruani komente për pedagogun ose link GitHub..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{submitting ? 'Duke dorëzuar...' : mySub ? 'Përditëso Dorëzimin' : 'Dorëzo Detyrën'}</span>
            </button>
          </form>
        </div>
      )}

      {/* PROFESSOR / ADMIN SECTION: Submissions Table */}
      {(isProfessor || isAdmin) && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dorëzimet e Studentëve</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gjithsej {assignment.submissions?.length || 0} studentë kanë dorëzuar këtë detyrë
              </p>
            </div>
          </div>

          {(!assignment.submissions || assignment.submissions.length === 0) ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Asnjë student nuk ka kryer dorëzim ende.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6 font-bold">Studenti</th>
                    <th className="py-3.5 px-6 font-bold">Grupi</th>
                    <th className="py-3.5 px-6 font-bold">Data e Dorëzimit</th>
                    <th className="py-3.5 px-6 font-bold">Statusi</th>
                    <th className="py-3.5 px-6 font-bold">Skedari</th>
                    <th className="py-3.5 px-6 font-bold">Nota</th>
                    <th className="py-3.5 px-6 font-bold text-right">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignment.submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {sub.student?.firstName} {sub.student?.lastName}
                        <div className="text-[11px] font-normal text-slate-400">{sub.student?.email}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{sub.student?.group || '-'}</td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(sub.submittedAt).toLocaleString('sq-AL')}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 font-bold rounded-full border ${STATUS_COLORS[sub.status] || 'bg-slate-100'}`}>
                          {STATUS_LABELS[sub.status] || sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {sub.fileUrl ? (
                          <a
                            href={`${SERVER_BASE_URL}${sub.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 font-bold text-blue-600 hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Shkarko</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">Vetëm tekst</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {sub.grade !== null && sub.grade !== undefined ? (
                          <span className="font-extrabold text-emerald-700 text-xs">{sub.grade} / 100</span>
                        ) : (
                          <span className="text-slate-400">Pa vlerësuar</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors"
                        >
                          {sub.grade !== null && sub.grade !== undefined ? 'Rishiko Notën' : 'Vendos Notë'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal për Vendosjen e Notës */}
      {gradingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Vlerësimi i Detyrës</h3>
                <p className="text-xs text-slate-500">
                  Studenti: {selectedSub?.student?.firstName} {selectedSub?.student?.lastName}
                </p>
              </div>
              <button onClick={() => setGradingModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nota (0 - 100)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="p.sh. 90"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Koment & Reagim (Feedback)
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Shkruani komente vlerësuese për studentin..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingModal(false)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={gradingLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {gradingLoading ? 'Duke ruajtur...' : 'Ruaj Notën'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;
