import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}

export function StarRating({ rating, maxRating = 5, size = 16, className, showValue = false }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <span key={i} className="relative inline-block">
            <Star
              size={size}
              className="text-gray-200 fill-gray-200"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star size={size} className="text-yellow-400 fill-yellow-400" />
              </span>
            )}
          </span>
        );
      })}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}
