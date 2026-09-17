import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createReview } from '../../services/reviewService';
import { Star, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReviewFormProps {
  menuItemId: string;
  onReviewAdded?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ menuItemId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isAuthenticated) {
    return (
      <div className="bg-dark-900/60 p-6 rounded-2xl border border-gray-800 text-center space-y-3">
        <p className="text-gray-300 text-sm">Have you tasted this dish?</p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30 text-xs font-semibold hover:bg-gold-500 hover:text-black transition"
        >
          Sign in to leave a review
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!comment.trim()) {
      setError('Please share your thoughts in a comment.');
      return;
    }

    try {
      setSubmitting(true);
      await createReview({
        menuItem: menuItemId,
        rating,
        comment: comment.trim()
      });
      setSuccess(true);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError((err as Error).message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark-900/80 p-6 rounded-2xl border border-gray-800 space-y-4">
      <h4 className="font-serif font-bold text-gray-100 text-base">Write a Customer Review</h4>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Thank you! Your review has been posted.</span>
        </div>
      )}

      {/* Star Rating Picker */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Your Rating:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= (hoverRating || rating)
                    ? 'text-gold-400 fill-current'
                    : 'text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-gold-400 ml-2">{rating} / 5 Stars</span>
      </div>

      {/* Comment Input */}
      <div>
        <textarea
          rows={3}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe the flavor, texture, presentation, and dining experience..."
          className="w-full p-3 bg-dark-900 border border-gray-800 rounded-xl text-gray-100 focus:outline-none focus:border-gold-500 text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs gold-glow transition flex items-center gap-2 disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        {submitting ? 'Submitting Review...' : 'Submit Review'}
      </button>
    </form>
  );
};
