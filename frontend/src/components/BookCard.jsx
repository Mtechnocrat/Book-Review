import React from 'react';
import { Link } from 'react-router-dom';
import { AverageRating } from './StarRating';

const BookCard = ({ book }) => {
  // Default values if book data is incomplete
  const {
    _id,
    title = 'Untitled',
    author = 'Unknown Author',
    genre = 'Unknown Genre',
    averageRating = 0,
    reviewCount = 0,
    createdAt,
    description = ''
  } = book || {};

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  // Truncate description
  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Get genre color
  const getGenreColor = (genre) => {
    const colors = {
      fiction: 'bg-blue-100 text-blue-800',
      mystery: 'bg-purple-100 text-purple-800',
      romance: 'bg-pink-100 text-pink-800',
      thriller: 'bg-red-100 text-red-800',
      fantasy: 'bg-green-100 text-green-800',
      'science fiction': 'bg-indigo-100 text-indigo-800',
      biography: 'bg-yellow-100 text-yellow-800',
      history: 'bg-orange-100 text-orange-800',
      'self-help': 'bg-teal-100 text-teal-800',
      'non-fiction': 'bg-gray-100 text-gray-800',
      default: 'bg-gray-100 text-gray-800'
    };
    
    return colors[genre.toLowerCase()] || colors.default;
  };

  if (!book) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <Link
              to={`/book/${_id}`}
              className="block group-hover:text-blue-600 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              by <span className="font-medium">{author}</span>
            </p>
          </div>
          
          {/* Genre Badge */}
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${getGenreColor(genre)}
          `}>
            {genre}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {truncateText(description)}
          </p>
        )}

        {/* Rating */}
        <div className="mb-4">
          <AverageRating 
            rating={averageRating} 
            reviewCount={reviewCount} 
            size="small"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            {createdAt && (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Added {formatDate(createdAt)}
              </>
            )}
          </div>
          
          <Link
            to={`/book/${_id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            View Details
            <svg 
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Skeleton loading component
export const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-16 ml-2"></div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export default BookCard;