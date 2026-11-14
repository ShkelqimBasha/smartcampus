import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ROLE_LABELS, ROLE_COLORS } from '../utils/constants';
import { TableRowSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Avatar from '../components/Avatar';
import { motion } from 'framer-motion';
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
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Menaxhimi i Përdoruesve
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kontrolli i llogarive universitare, ndryshimi i roleve dhe pezullimi i aksesit
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Kërko me emër ose email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'Të Gjithë' },
            { id: 'STUDENT', label: 'Studentë' },
            { id: 'PROFESSOR', label: 'Pedagogë' },
            { id: 'ADMIN', label: 'Administratorë' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setRoleFilter(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                roleFilter === pill.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                  <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                      <Avatar user={u} size="sm" />
                      <span>
                        {u.firstName} {u.lastName}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400">
                      {u.faculty || '-'} {u.group ? `(${u.group})` : ''}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2.5 py-1 font-bold rounded-full border ${
                          ROLE_COLORS[u.role] || 'bg-slate-100 dark:bg-slate-800'
                        }`}
                      >
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                        }`}
                      >
                        {u.isActive ? 'Aktiv' : 'I Pezulluar'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                          u.isActive
                            ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900'
                            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                        }`}
                      >
                        {u.isActive ? 'Pezullo' : 'Aktivizo'}
                      </motion.button>
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
