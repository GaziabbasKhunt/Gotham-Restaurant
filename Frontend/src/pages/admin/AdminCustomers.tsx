import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import { getUsers, updateUserRole, deleteUser } from '../../services/userService';
import { User, UserRole } from '../../types';
import { Users, Shield, Trash2, Check, AlertCircle, Search } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        setError(res.message || 'Failed to fetch users');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (id: string, currentRole: UserRole) => {
    const newRole: UserRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

    try {
      setActionId(id);
      setError(null);
      const res = await updateUserRole(id, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
        setSuccessMsg(`User role updated to ${newRole}`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user account "${name}"?`)) return;
    try {
      setActionId(id);
      setError(null);
      const res = await deleteUser(id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setSuccessMsg(`Deleted account for ${name}`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <Users className="w-7 h-7 text-gold-400" />
              <span>Customer Accounts Directory</span>
            </h2>
            <p className="text-sm text-gray-400">View registered members and elevate privileges</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center space-x-2 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center space-x-2 text-sm">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-dark-800 border border-gold-500/20 rounded-xl p-4 mb-8 shadow-lg">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {loading ? (
          <Loading message="Fetching customer accounts..." />
        ) : filteredUsers.length > 0 ? (
          <div className="bg-dark-800 border border-gold-500/20 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-dark-900/80 text-xs text-gold-400 uppercase border-b border-dark-700">
                  <tr>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/50">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-dark-700/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-100">{u.name}</td>
                      <td className="py-3.5 px-4 text-gray-300">{u.email}</td>
                      <td className="py-3.5 px-4 text-gray-400">{u.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            u.role === 'admin'
                              ? 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {u.role === 'admin' && <Shield className="w-3 h-3" />}
                          <span className="uppercase">{u.role}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          disabled={actionId === u._id}
                          onClick={() => handleRoleToggle(u._id, u.role)}
                          className="px-2.5 py-1 bg-dark-700 hover:bg-gold-500/20 text-xs text-gray-300 hover:text-gold-400 border border-dark-600 rounded-lg transition-colors"
                        >
                          {u.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                        </button>
                        <button
                          disabled={actionId === u._id}
                          onClick={() => handleDelete(u._id, u.name)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-800 border border-gold-500/20 rounded-xl text-gray-400">
            No registered users match your search.
          </div>
        )}
      </div>
    </div>
  );
};
