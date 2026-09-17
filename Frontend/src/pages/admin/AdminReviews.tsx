import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Loading } from '../../components/common/Loading';
import { getAllReviews, moderateReview, deleteReview } from '../../services/reviewService';
import { Review } from '../../types';
import { Star, CheckCircle, XCircle, Trash2, Check, AlertCircle } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getAllReviews();
      if (res.success && res.data) {
        setReviews(res.data);
      } else {
        setError(res.message || 'Failed to fetch reviews');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, isApproved: boolean) => {
    try {
      setActionId(id);
      setError(null);
      const res = await moderateReview(id, isApproved);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isApproved } : r))
        );
        setSuccessMsg(isApproved ? 'Review approved' : 'Review unapproved');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to moderate review');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      setActionId(id);
      setError(null);
      const res = await deleteReview(id);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
        setSuccessMsg('Review deleted');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to delete review');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-16">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-100 flex items-center space-x-3">
              <Star className="w-7 h-7 text-gold-400" />
              <span>Review Moderation</span>
            </h2>
            <p className="text-sm text-gray-400">Moderate customer feedback and ratings across dishes</p>
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

        {loading ? (
          <Loading message="Fetching customer reviews..." />
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-dark-800 border border-gold-500/20 rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating ? 'fill-current text-gold-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-200">
                      Dish:{' '}
                      <strong className="text-gold-400">
                        {typeof r.menuItem === 'object' ? (r.menuItem as { name?: string }).name : r.menuItem}
                      </strong>
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        r.isApproved
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {r.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 italic">"{r.comment}"</p>

                  <p className="text-xs text-gray-500">
                    By {typeof r.user === 'object' ? (r.user as { name?: string })?.name : 'Customer'} •{' '}
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-auto">
                  {r.isApproved ? (
                    <button
                      disabled={actionId === r._id}
                      onClick={() => handleModerate(r._id, false)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Unapprove</span>
                    </button>
                  ) : (
                    <button
                      disabled={actionId === r._id}
                      onClick={() => handleModerate(r._id, true)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    disabled={actionId === r._id}
                    onClick={() => handleDelete(r._id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-800 border border-gold-500/20 rounded-xl text-gray-400">
            No customer dish reviews recorded.
          </div>
        )}
      </div>
    </div>
  );
};
