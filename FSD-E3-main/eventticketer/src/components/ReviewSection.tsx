import { useState } from 'react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEvents, Review } from '../context/EventContext';

interface ReviewSectionProps {
  eventId: string;
}

export default function ReviewSection({ eventId }: ReviewSectionProps) {
  const { reviews, addReview } = useEvents();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventReviews = reviews.filter(r => r.eventId === eventId);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to leave a review.");
      return;
    }
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    
    const newReview: Review = {
      eventId,
      userEmail: user.email,
      userName: user.name,
      rating,
      comment
    };

    setTimeout(() => {
      addReview(newReview);
      setRating(0);
      setComment('');
      setIsSubmitting(false);
    }, 500);
  };

  const averageRating = eventReviews.length > 0 
    ? (eventReviews.reduce((acc, r) => acc + r.rating, 0) / eventReviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-12 pt-12 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-serif text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            Reviews
          </h3>
          <p className="text-sm text-text-dim mt-1">
            {eventReviews.length} people have shared their experience
          </p>
        </div>
        {averageRating !== 0 && (
          <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl border border-accent/20">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-lg font-bold text-accent">{averageRating}</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-12 bg-surface/50 border border-border rounded-2xl p-6">
          <label className="block text-[10px] font-bold text-text-dim uppercase tracking-wider mb-4">Leave your rating</label>
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    (hover || rating) >= star ? 'text-accent fill-accent' : 'text-text-dim'
                  }`} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full bg-bg/50 border border-border rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/50 transition-all resize-none min-h-[100px]"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-highlight text-bg font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Review
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {eventReviews.length === 0 ? (
          <div className="text-center py-12 text-text-dim italic text-sm border border-dashed border-border rounded-2xl">
            Be the first to review this event!
          </div>
        ) : (
          eventReviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface/30 border border-border rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{review.userName}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-accent fill-accent' : 'text-text-dim'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-text-dim text-sm leading-relaxed">
                {review.comment}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
