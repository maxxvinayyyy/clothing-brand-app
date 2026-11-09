import { Review } from '@/lib/types';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">{review.user.name}</p>
          <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
