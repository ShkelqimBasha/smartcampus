import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { roomsService } from '../services/api';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  Building,
  Plus,
  Users,
  Tv,
  CheckCircle2,
  BookmarkCheck,
  X,
  Check,
  Sparkles
} from 'lucide-react';

const Rooms = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 30,
    building: 'Ndërtesa A',
    equipment: 'Projektor, Tabelë e Bardhë, Wi-Fi'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await roomsService.getAll();
      setRooms(res.data.rooms || []);
    } catch (error) {
      console.error(error);
      showToast('Dështoi ngarkimi i sallave.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await roomsService.create(formData);
      setShowModal(false);
      setFormData({
        name: '',
        capacity: 30,
        building: '',
        equipment: ''
      });
      showToast('Salla u shtua me sukses!', 'success');
      fetchRooms();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Dështoi shtimi i sallës.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sallat & Amfiteatrot</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ambiente universitare për leksione, provime dhe mbledhje
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/bookings')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm transition-all"
          >
            <BookmarkCheck className="w-4 h-4 text-blue-600" />
            <span>Shiko Rezervimet</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Sallë</span>
            </button>
          )}
        </div>
      </div>

      {/* Rooms Cards Grid (Kërkesa 5.2) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={Building}
          title="Nuk ka salla të regjistruara"
          description="Sallat dhe amfiteatrot mund të shtohen nga administratori."
          actionLabel={isAdmin ? "Shto Sallë të Re" : null}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {rooms.map((room) => {
            const equipmentList = room.equipment
              ? room.equipment.split(',').map((e) => e.trim())
              : [];

            return (
              <div
                key={room.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm shadow-blue-500/20">
                      {room.name}
                    </div>

                    {/* Badge Kapaciteti 👥 */}
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center space-x-1">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span>{room.capacity} vende</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>🏢 Salla {room.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{room.building}</p>

                  {/* Lista e Pajisjeve me ✅ (Kërkesa 5.2) */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Pajisjet e Disponueshme:
                    </p>
                    {equipmentList.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {equipmentList.map((item, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center space-x-1"
                          >
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Pajisje standarde</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/bookings?roomId=${room.id}`)}
                    className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Rezervo këtë sallë</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Krijimi i Sallës */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Shto Sallë të Re</h3>
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
                  Emri i Sallës
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="p.sh. A104 ose LAB3"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Kapaciteti (vende)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Ndërtesa
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    placeholder="p.sh. Ndërtesa A"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pajisjet (të ndara me presje)
                </label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  placeholder="p.sh. Projektor, Smart Board, Klimë"
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
                  {submitting ? 'Duke shtuar...' : 'Shto Sallën'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
