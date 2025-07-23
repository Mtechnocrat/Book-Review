import React, { useState } from 'react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'medium',
  showValue = false 
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  // Size configurations
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xlarge: 'w-8 h-8'
  };

  const containerClasses = {
    small: 'gap-1',
    medium: 'gap-1',
    large: 'gap-2',
    xlarge: 'gap-2'
  };

  const handleStarClick = (starRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (!readonly) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  const renderStar = (starIndex) => {
    const isFilled = starIndex <= (hoveredRating || rating);
    const isHalfFilled = !Number.isInteger(rating) && starIndex === Math.ceil(rating) && !hoveredRating;

    return (
      <button
        key={starIndex}
        type="button"
        className={`
          ${sizeClasses[size]}
          ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded
          ${!readonly ? 'active:scale-95' : ''}
        `}
        onClick={() => handleStarClick(starIndex)}
        onMouseEnter={() => handleStarHover(starIndex)}
        disabled={readonly}
        aria-label={`${starIndex} star${starIndex > 1 ? 's' : ''}`}
      >
        {isHalfFilled ? (
          // Half-filled star
          <div className="relative">
            <svg
              className={`${sizeClasses[size]} text-gray-300`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <svg
                className={`${sizeClasses[size]} text-yellow-400`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        ) : (
          // Full or empty star
          <svg
            className={`${sizeClasses[size]} ${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            } transition-colors duration-200`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center">
      <div 
        className={`flex ${containerClasses[size]}`}
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
        aria-label="Star rating"
      >
        {[1, 2, 3, 4, 5].map(renderStar)}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating > 0 ? `${rating}/5` : 'No rating'}
        </span>
      )}
      
      {!readonly && (
        <span className="ml-2 text-xs text-gray-500">
          {hoveredRating > 0 ? `${hoveredRating}/5` : 'Click to rate'}
        </span>
      )}
    </div>
  );
};

// Helper component for displaying average ratings
export const AverageRating = ({ rating, reviewCount = 0, size = 'medium' }) => {
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

  return (
    <div className="flex items-center space-x-2">
      <StarRating 
        rating={roundedRating} 
        readonly={true} 
        size={size}
      />
      <span className="text-sm text-gray-600">
        {rating > 0 ? (
          <>
            <span className="font-medium">{rating.toFixed(1)}</span>
            {reviewCount > 0 && (
              <span className="text-gray-500">
                {' '}({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </span>
            )}
          </>
        ) : (
          <span className="text-gray-500">No reviews yet</span>
        )}
      </span>
    </div>
  );
};

export default StarRating;