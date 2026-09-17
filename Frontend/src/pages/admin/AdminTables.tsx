import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  TablePayload
} from '../../services/tableService';
import { RestaurantTable, TableStatus } from '../../types';
import { Grid, Plus, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';

export const AdminTables: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [formData, setFormData] = useState<TablePayload>({
    tableNumber: '',
    capacity: 4,
    location: 'Main Dining Hall',
    status: 'available',
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await getTables();
      if (res.success && res.data) {
        setTables(res.data);
      } else {
        setError(res.message || 'Failed to load tables');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleOpenModal = (tbl?: RestaurantTable) => {
    if (tbl) {
      setEditingTable(tbl);
      setFormData({
        tableNumber: tbl.tableNumber,
        capacity: tbl.capacity,
        location: tbl.location || 'Main Dining Hall',
        status: tbl.status,
        isActive: tbl.isActive
      });
    } else {
      setEditingTable(null);
      setFormData({
        tableNumber: `T-${String(tables.length + 1).padStart(2, '0')}`,
        capacity: 4,
        location: 'Main Dining Hall',
        status: 'available',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const payload: TablePayload = {
        ...formData,
        capacity: Number(formData.capacity)
      };

      if (editingTable) {
        const res = await updateTable(editingTable._id, payload);
        if (res.success) setSuccessMsg(`Updated ${formData.tableNumber}`);
      } else {
        const res = await createTable(payload);
        if (res.success) setSuccessMsg(`Created ${formData.tableNumber}`);
      }

      setIsModalOpen(false);
      fetchTables();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to save table');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, num: string) => {
    if (!window.confirm(`Are you sure you want to delete table ${num}?`)) return;
    try {
      setError(null);
      const res = await deleteTable(id);
      if (res.success) {
        setSuccessMsg(`Deleted table ${num}`);
        fetchTables();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to delete table');
    }
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'reserved':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'occupied':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'maintenance':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <Grid className="w-7 h-7 text-gold-400" />
              <span>Table Layout & Floor Management</span>
            </h2>
            <p className="text-sm text-gray-400">Configure floor tables, capacity, and current operational states</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Restaurant Table</span>
          </button>
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

        {loading ? (
          <Loading message="Fetching Gotham dining tables..." />
        ) : tables.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((t) => (
              <div
                key={t._id}
                className="bg-dark-800 border border-gold-500/20 rounded-xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-mono font-bold text-xl text-gold-400">Table {t.tableNumber}</h3>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase ${getStatusBadge(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-200 font-medium">{t.location || 'Main Floor'}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.capacity} Person Capacity</p>
                </div>

                <div className="pt-4 mt-4 border-t border-dark-700/50 flex justify-between items-center">
                  <span className={`text-xs ${t.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.isActive ? '● Active' : '○ Inactive'}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleOpenModal(t)}
                      className="p-1.5 text-gray-400 hover:text-gold-400 hover:bg-dark-700 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id, t.tableNumber)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-dark-700 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-800 border border-gold-500/20 rounded-xl text-gray-400">
            No tables configured yet.
          </div>
        )}
      </div>

      {/* Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-gold-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-gray-100 mb-4">
              {editingTable ? 'Edit Table Configuration' : 'Add New Table'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Table Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T-01, VIP-1"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Guest Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Location / Zone</label>
                <input
                  type="text"
                  placeholder="e.g. Patio, Private Lounge, Main Floor"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TableStatus })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gold-400"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-gold-500 focus:ring-gold-400 bg-dark-900 border-dark-700"
                  />
                  <span>Active Table</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold bg-gold-500 hover:bg-gold-600 text-dark-900 rounded-xl transition-colors shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingTable ? 'Update Table' : 'Create Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
