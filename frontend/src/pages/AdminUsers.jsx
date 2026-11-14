import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ROLE_LABELS, ROLE_COLORS } from '../utils/constants';
import { TableRowSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Filter
} from 'lucide-react';

const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authService.getAllUsers();
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
      showToast('Dështoi ngarkimi i listës së përdoruesve.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await authService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast('Roli i përdoruesit u përditësua me sukses!', 'success');
    } catch (error) {
      showToast('Dështoi ndryshimi i rolit.', 'error');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await authService.toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: res.data.user.isActive } : u))
      );
      showToast(res.data.message || 'Statusi u ndryshua.', 'success');
    } catch (error) {
      showToast('Dështoi ndryshimi i statusit.', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Menaxhimi i Përdoruesve</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Caktoni rolet dhe kontrolloni statusin e studentëve, pedagogëve dhe administratorëve
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Kërko përdorues sipas emrit ose email-it..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="ALL">Të gjitha rolet ({users.length})</option>
          <option value="STUDENT">Studentë</option>
          <option value="PROFESSOR">Pedagogë</option>
          <option value="ADMIN">Administratorë</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6 font-bold">Përdoruesi</th>
                <th className="py-3.5 px-6 font-bold">Email</th>
                <th className="py-3.5 px-6 font-bold">Fakulteti / Grupi</th>
                <th className="py-3.5 px-6 font-bold">Roli Aktual</th>
                <th className="py-3.5 px-6 font-bold">Ndrysho Rolin</th>
                <th className="py-3.5 px-6 font-bold">Statusi</th>
                <th className="py-3.5 px-6 font-bold text-right">Veprime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <>
                  <TableRowSkeleton cols={7} />
                  <TableRowSkeleton cols={7} />
                  <TableRowSkeleton cols={7} />
                </>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <EmptyState
                      icon={Users}
                      title="Nuk u gjet asnjë përdorues"
                      description="Nuk ka asnjë përdorues që përputhet me kriteret e kërkimit."
                    />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center space-x-2.5">
                      <Avatar user={u} size="sm" />
                      <span>{u.firstName} {u.lastName}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {u.faculty || '-'} {u.group ? `(${u.group})` : ''}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2.5 py-1 font-bold rounded-full border ${
                          ROLE_COLORS[u.role] || 'bg-slate-100'
                        }`}
                      >
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="PROFESSOR">Pedagog</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2.5 py-1 font-bold rounded-full ${
                          u.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.isActive ? 'Aktiv' : 'I Pezulluar'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                          u.isActive
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Pezullo' : 'Aktivizo'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
