import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center space-x-1.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={14}
                    className={`${i < fullStars
                        ? 'fill-rating-stars text-rating-stars drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]'
                        : i === fullStars && hasHalfStar
                            ? 'fill-rating-stars/50 text-rating-stars/50'
                            : 'text-white/10'
                        } transition-all duration-300`}
                />
            ))}
            <span className="ml-3 text-sm text-text-secondary font-black tracking-widest uppercase opacity-60">{rating}</span>
        </div>
    );
};

export default StarRating;
