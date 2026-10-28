import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Star, MessageSquare, Send } from 'lucide-react';

export const FeedbackModal = ({
  isOpen,
  onClose,
  complaint,
  onSubmitFeedback,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const ratingLabels = {
    1: 'Poor / Unsatisfactory',
    2: 'Needs Improvement',
    3: 'Average Resolution',
    4: 'Good & Timely',
    5: 'Excellent & Outstanding',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      setError('Please select a star rating from 1 to 5.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmitFeedback(complaint.id, { rating, comments });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!complaint) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resolution Feedback & Rating"
      subtitle={`Ticket: ${complaint.complaintCode} — ${complaint.title}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Rate Your Resolution Experience
          </label>
          <div className="flex items-center gap-2 justify-center py-2 bg-slate-50 rounded-xl border border-slate-100">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                aria-label={`Rate ${star} star`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-semibold text-slate-700 mt-2">
            {ratingLabels[hoverRating || rating]}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Comments & Suggestions (Optional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            placeholder="Share feedback on technician response time, quality of repair, or campus facility..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow-blue-500/25 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
