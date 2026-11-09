import { Review } from '@/lib/types';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-bold text-white">{review.user.name}</p>
          <p className="text-[11px] text-neutral-400">{formatDate(review.createdAt)}</p>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>
      {review.comment && (
        <p className="text-xs text-neutral-300 leading-relaxed font-light mt-2">{review.comment}</p>
      )}
    </div>
  );
}
