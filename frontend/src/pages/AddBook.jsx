import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/api';
import { 
  validateBookTitle, 
  validateAuthor, 
  validateGenre,
  sanitizeInput 
} from '../utils/validate';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    isbn: '',
    publishedYear: '',
    publisher: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const navigate = useNavigate();

  // Common genres for suggestions
  const commonGenres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Thriller',
    'Biography',
    'History',
    'Self-Help',
    'Horror',
    'Adventure',
    'Comedy',
    'Drama',
    'Poetry',
    'Philosophy',
    'Psychology',
    'Technology',
    'Business',
    'Health'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = sanitizeInput(value);

    // Special handling for certain fields
    if (name === 'publishedYear') {
      // Only allow numbers for year
      sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 4) {
        sanitizedValue = sanitizedValue.slice(0, 4);
      }
    } else if (name === 'isbn') {
      // Allow alphanumeric and hyphens for ISBN
      sanitizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear server error
    if (serverError) {
      setServerError('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    const titleError = validateBookTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    // Author validation
    const authorError = validateAuthor(formData.author);
    if (authorError) newErrors.author = authorError;

    // Genre validation
    const genreError = validateGenre(formData.genre);
    if (genreError) newErrors.genre = genreError;

    // Description validation (optional but if provided, should be reasonable)
    if (formData.description && formData.description.trim().length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    // Published year validation (optional)
    if (formData.publishedYear) {
      const year = parseInt(formData.publishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1000 || year > currentYear + 1) {
        newErrors.publishedYear = `Published year must be between 1000 and ${currentYear + 1}`;
      }
    }

    // ISBN validation (optional)
    if (formData.isbn && formData.isbn.length > 0) {
      const isbnLength = formData.isbn.replace(/-/g, '').length;
      if (isbnLength !== 10 && isbnLength !== 13) {
        newErrors.isbn = 'ISBN must be 10 or 13 digits long';
      }
    }

    // Publisher validation (optional)
    if (formData.publisher && formData.publisher.trim().length > 100) {
      newErrors.publisher = 'Publisher name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      // Prepare book data
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim(),
        ...(formData.description && { description: formData.description.trim() }),
        ...(formData.isbn && { isbn: formData.isbn.trim() }),
        ...(formData.publishedYear && { publishedYear: parseInt(formData.publishedYear) }),
        ...(formData.publisher && { publisher: formData.publisher.trim() })
      };

      const response = await bookAPI.createBook(bookData);
      
      if (response.success) {
        // Redirect to the new book's detail page
        navigate(`/book/${response.data._id}`, {
          state: { message: 'Book added successfully!' }
        });
      } else {
        setServerError(response.message || 'Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      setServerError(
        error.message || 
        'Failed to add book. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      genre: '',
      description: '',
      isbn: '',
      publishedYear: '',
      publisher: ''
    });
    setErrors({});
    setServerError('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
        <p className="mt-2 text-gray-600">
          Share a book with our community and help others discover great reads
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Server Error Alert */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{serverError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Required Fields Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-500">Fields marked with * are required</p>
            </div>

            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className={`
                  input-field
                  ${errors.title ? 'ring-red-500 border-red-500' : 'border-gray-300'}
                `}
                placeholder="Enter the book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Author Field */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                required
                value={formData.author}
                onChange={handleChange}
                className={`
                  input-field
                  ${errors.author ? 'ring-red-500 border-red-500' : 'border-gray-300'}
                `}
                placeholder="Enter the author's name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            {/* Genre Field */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <div className="relative">
                <input
                  id="genre"
                  name="genre"
                  type="text"
                  required
                  value={formData.genre}
                  onChange={handleChange}
                  className={`
                    input-field
                    ${errors.genre ? 'ring-red-500 border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Enter the book genre"
                  list="genre-suggestions"
                />
                <datalist id="genre-suggestions">
                  {commonGenres.map((genre) => (
                    <option key={genre} value={genre} />
                  ))}
                </datalist>
              </div>
              {errors.genre && (
                <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Start typing to see genre suggestions
              </p>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              <p className="text-sm text-gray-500">Optional fields to provide more details about the book</p>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`
                  input-field resize-none
                  ${errors.description ? 'ring-red-500 border-red-500' : 'border-gray-300'}
                `}
                placeholder="Enter a brief description of the book (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* Row for ISBN and Published Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ISBN Field */}
              <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN
                </label>
                <input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={handleChange}
                  className={`
                    input-field
                    ${errors.isbn ? 'ring-red-500 border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="978-0-123456-78-9"
                />
                {errors.isbn && (
                  <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  10 or 13 digits (with or without hyphens)
                </p>
              </div>

              {/* Published Year Field */}
              <div>
                <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Published Year
                </label>
                <input
                  id="publishedYear"
                  name="publishedYear"
                  type="text"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  className={`
                    input-field
                    ${errors.publishedYear ? 'ring-red-500 border-red-500' : 'border-gray-300'}
                  `}
                  placeholder={new Date().getFullYear().toString()}
                  maxLength="4"
                />
                {errors.publishedYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.publishedYear}</p>
                )}
              </div>
            </div>

            {/* Publisher Field */}
            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
                Publisher
              </label>
              <input
                id="publisher"
                name="publisher"
                type="text"
                value={formData.publisher}
                onChange={handleChange}
                className={`
                  input-field
                  ${errors.publisher ? 'ring-red-500 border-red-500' : 'border-gray-300'}
                `}
                placeholder="Enter the publisher's name"
              />
              {errors.publisher && (
                <p className="mt-1 text-sm text-red-600">{errors.publisher}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Reset Form
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }
                  transition-colors duration-200
                `}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Book...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Book
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Adding Books</h4>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Only title, author, and genre are required</li>
                <li>Adding a description helps other users discover the book</li>
                <li>ISBN and publication details help identify the exact edition</li>
                <li>Make sure the book doesn't already exist in our collection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBook;