import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingsService, roomsService } from '../services/api';
import { STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import { TableRowSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  BookmarkCheck,
  Plus,
  Clock,
  Calendar,
  Building,
  Check,
  X,
  Filter,
  AlertTriangle
} from 'lucide-react';

const Bookings = () => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    date: '',
    startTime: '10:00',
    endTime: '12:00',
    purpose: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookRes, roomRes] = await Promise.all([
        bookingsService.getAll(),
        roomsService.getAll()
      ]);

      setBookings(bookRes.data.bookings || []);
      const loadedRooms = roomRes.data.rooms || [];
      setRooms(loadedRooms);

      // Kontrollo nëse vjen roomId nga URL
      const queryParams = new URLSearchParams(location.search);
      const preselectedRoomId = queryParams.get('roomId');
      if (preselectedRoomId && loadedRooms.some((r) => r.id === preselectedRoomId)) {
        setFormData((prev) => ({ ...prev, roomId: preselectedRoomId }));
        setShowModal(true);
      } else if (loadedRooms.length > 0) {
        setFormData((prev) => ({ ...prev, roomId: loadedRooms[0].id }));
      }
    } catch (error) {
      console.error(error);
      showToast('Dështoi ngarkimi i rezervimeve.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('A jeni të sigurt që dëshironi të miratoni këtë rezervim?')) return;
    try {
      await bookingsService.approve(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'APPROVED' } : b))
      );
      showToast('Rezervimi u miratua me sukses!', 'success');
    } catch (error) {
      showToast('Dështoi miratimi i rezervimit.', 'error');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('A jeni të sigurt që dëshironi të refuzoni këtë rezervim?')) return;
    try {
      await bookingsService.reject(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'REJECTED' } : b))
      );
      showToast('Rezervimi u refuzua.', 'info');
    } catch (error) {
      showToast('Dështoi refuzimi i rezervimit.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await bookingsService.create(formData);
      setShowModal(false);
      setFormData({
        roomId: rooms[0]?.id || '',
        date: '',
        startTime: '10:00',
        endTime: '12:00',
        purpose: ''
      });
      showToast('Kërkesa u dërgua me sukses dhe është në shqyrtim!', 'success');
      fetchData();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Dështoi rezervimi për shkak konflikti orari.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rezervimet e Sallave</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kërkesat për përdorimin e sallave, amfiteatrove dhe laboratorëve
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Krijo Rezervim</span>
        </button>
      </div>

      {/* Status Filter Tabs (Kërkesa 5.2) */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            statusFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Të Gjitha ({bookings.length})
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            statusFilter === 'PENDING'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Në Pritje ({bookings.filter((b) => b.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setStatusFilter('APPROVED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            statusFilter === 'APPROVED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Të Miratuara ({bookings.filter((b) => b.status === 'APPROVED').length})
        </button>
        <button
          onClick={() => setStatusFilter('REJECTED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            statusFilter === 'REJECTED'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Të Refuzuara ({bookings.filter((b) => b.status === 'REJECTED').length})
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Salla & Ndërtesa</th>
                <th className="py-3.5 px-6 font-bold">Përdoruesi</th>
                <th className="py-3.5 px-6 font-bold">Data</th>
                <th className="py-3.5 px-6 font-bold">Orari</th>
                <th className="py-3.5 px-6 font-bold">Qëllimi</th>
                <th className="py-3.5 px-6 font-bold">Statusi</th>
                {isAdmin && <th className="py-3.5 px-6 font-bold text-right">Veprime</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <>
                  <TableRowSkeleton cols={isAdmin ? 7 : 6} />
                  <TableRowSkeleton cols={isAdmin ? 7 : 6} />
                  <TableRowSkeleton cols={isAdmin ? 7 : 6} />
                </>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-slate-400">
                    <EmptyState
                      icon={BookmarkCheck}
                      title="Nuk ka rezervime në këtë kategori"
                      description="Nuk u gjet asnjë kërkesë rezervimi për filtrin e zgjedhur."
                      actionLabel="Kërko Rezervim të Ri"
                      onAction={() => setShowModal(true)}
                    />
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      Salla {b.room?.name}
                      <div className="text-[11px] font-normal text-slate-400">{b.room?.building}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="font-bold text-slate-900">
                        {b.user?.firstName} {b.user?.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400">{b.user?.role}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {new Date(b.date).toLocaleDateString('sq-AL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {b.startTime} - {b.endTime}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                      {b.purpose}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 font-bold rounded-full border ${
                          STATUS_COLORS[b.status] || 'bg-slate-100'
                        }`}
                      >
                        {STATUS_LABELS[b.status] || b.status}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="py-4 px-6 text-right">
                        {b.status === 'PENDING' ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleApprove(b.id)}
                              title="Mirato kërkesën"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(b.id)}
                              title="Refuzo kërkesën"
                              className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Përfunduar</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Krijimi i Rezervimit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Kërko Rezervim Salle</h3>
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
                  Zgjidh Sallën
                </label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      Salla {room.name} ({room.building} - {room.capacity} vende)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Data e Rezervimit
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Qëllimi i Rezervimit
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="p.sh. Punë në grup për projektin e kursit, seminar i hapur..."
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
                  {submitting ? 'Duke dërguar...' : 'Dërgo Kërkesën'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
