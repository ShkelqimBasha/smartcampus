import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { schedulesService } from '../services/api';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Building,
  User,
  Trash2,
  Edit2,
  X
} from 'lucide-react';

const DAYS = [
  { id: 1, name: 'E Hënë' },
  { id: 2, name: 'E Martë' },
  { id: 3, name: 'E Mërkurë' },
  { id: 4, name: 'E Enjte' },
  { id: 5, name: 'E Premte' }
];

// Paletë ngjyrash të buta për kartat e lëndëve (Kërkesa 5.2)
const subjectColorPalettes = [
  'border-l-blue-600 bg-blue-50/20',
  'border-l-purple-600 bg-purple-50/20',
  'border-l-emerald-600 bg-emerald-50/20',
  'border-l-amber-600 bg-amber-50/20',
  'border-l-rose-600 bg-rose-50/20'
];

const Schedule = () => {
  const { user, isAdmin, isProfessor } = useAuth();
  const { showToast } = useToast();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1); // Parazgjedhja: E Hënë (1)
  const [groupFilter, setGroupFilter] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    faculty: user?.faculty || 'Fakulteti i Teknologjisë së Informacionit',
    group: user?.group || 'FTI-1',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '11:00',
    room: 'A101'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = {};
      if (groupFilter) params.group = groupFilter;
      const res = await schedulesService.getAll(params);
      setSchedules(res.data.schedules || []);
    } catch (error) {
      console.error(error);
      showToast('Dështoi ngarkimi i orareve.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [groupFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni të sigurt që dëshironi të fshini këtë orar?')) return;
    try {
      await schedulesService.delete(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      showToast('Orari u fshi me sukses!', 'success');
    } catch (error) {
      showToast('Dështoi fshirja e orarit.', 'error');
    }
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      subject: item.subject,
      faculty: item.faculty,
      group: item.group,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room
    });
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      subject: '',
      faculty: user?.faculty || 'Fakulteti i Teknologjisë së Informacionit',
      group: user?.group || 'FTI-1',
      dayOfWeek: selectedDay,
      startTime: '09:00',
      endTime: '11:00',
      room: 'A101'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await schedulesService.update(editingId, formData);
        showToast('Orari u përditësua me sukses!', 'success');
      } else {
        await schedulesService.create(formData);
        showToast('Orari u shtua me sukses!', 'success');
      }
      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Dështoi ruajtja e orarit.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Numërimi i lëndëve për secilën ditë
  const getSubjectCountForDay = (dayId) => {
    return schedules.filter((s) => s.dayOfWeek === dayId).length;
  };

  const currentDaySchedules = schedules.filter(
    (item) => item.dayOfWeek === selectedDay
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Orari Mësimor Javor</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plani javor i leksioneve, seminareve dhe laboratorëve
          </p>
        </div>

        {(isAdmin || isProfessor) && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Shto Orar</span>
          </button>
        )}
      </div>

      {/* Day Tabs me Numër Lëndësh (Kërkesa 5.2) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
        {DAYS.map((day) => {
          const count = getSubjectCountForDay(day.id);
          const isSelected = selectedDay === day.id;

          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{day.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedules Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : currentDaySchedules.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title={`Nuk ka lëndë të planifikuara për ${DAYS.find((d) => d.id === selectedDay)?.name}`}
          description="Nuk ka orë mësimi të regjistruara për këtë ditë të javës."
          actionLabel={(isAdmin || isProfessor) ? "Shto Lëndë në Orar" : null}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentDaySchedules.map((item, index) => {
            const paletteClass = subjectColorPalettes[index % subjectColorPalettes.length];

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border border-slate-200 border-l-4 p-5 shadow hover:shadow-lg transition-all duration-200 flex flex-col justify-between ${paletteClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      Grupi: {item.group}
                    </span>

                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.startTime} - {item.endTime}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.subject}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{item.faculty}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Salla: <strong className="text-slate-800">{item.room}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Pedagogu:{' '}
                        <strong className="text-slate-800">
                          {item.professor?.firstName} {item.professor?.lastName}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {(isAdmin || (isProfessor && item.professorId === user?.id)) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edito orarin"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Fshi orarin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Krijimi / Editimi i Orarit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Edito Orarin Mësimor' : 'Shto Orë të Re në Orar'}
              </h3>
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
                  Emri i Lëndës
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="p.sh. Hartim dhe Menaxhim Projektesh"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Dita e Javës
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {DAYS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Salla
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="p.sh. A101"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Ora e Fillimit
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Ora e Mbarimit
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Fakulteti
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grupi
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {submitting ? 'Duke ruajtur...' : editingId ? 'Ruaj Ndryshimet' : 'Shto Orarin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
