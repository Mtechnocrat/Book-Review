// Validation utility functions

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.trim().length < 2) return `${fieldName} must be at least 2 characters long`;
  if (name.trim().length > 50) return `${fieldName} must be less than 50 characters`;
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  return null;
};

// Book title validation
export const validateBookTitle = (title) => {
  if (!title) return 'Book title is required';
  if (title.trim().length < 1) return 'Book title cannot be empty';
  if (title.trim().length > 200) return 'Book title must be less than 200 characters';
  return null;
};

// Author validation
export const validateAuthor = (author) => {
  if (!author) return 'Author name is required';
  if (author.trim().length < 2) return 'Author name must be at least 2 characters long';
  if (author.trim().length > 100) return 'Author name must be less than 100 characters';
  return null;
};

// Genre validation
export const validateGenre = (genre) => {
  if (!genre) return 'Genre is required';
  if (genre.trim().length < 2) return 'Genre must be at least 2 characters long';
  if (genre.trim().length > 50) return 'Genre must be less than 50 characters';
  return null;
};

// Review text validation
export const validateReviewText = (reviewText) => {
  if (!reviewText) return 'Review text is required';
  if (reviewText.trim().length < 10) return 'Review must be at least 10 characters long';
  if (reviewText.trim().length > 1000) return 'Review must be less than 1000 characters';
  return null;
};

// Rating validation
export const validateRating = (rating) => {
  if (!rating) return 'Rating is required';
  const numRating = Number(rating);
  if (!Number.isInteger(numRating)) return 'Rating must be a whole number';
  if (numRating < 1 || numRating > 5) return 'Rating must be between 1 and 5 stars';
  return null;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const validator = validationRules[field];
    
    if (typeof validator === 'function') {
      const error = validator(value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

// Sanitize input (remove HTML tags, trim whitespace)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim(); // Remove leading/trailing whitespace
};

// Sanitize form data
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    sanitized[key] = sanitizeInput(formData[key]);
  });
  
  return sanitized;
};

// Check if string contains only whitespace
export const isEmptyOrWhitespace = (str) => {
  return !str || str.trim().length === 0;
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateBookTitle,
  validateAuthor,
  validateGenre,
  validateReviewText,
  validateRating,
  validateForm,
  sanitizeInput,
  sanitizeFormData,
  isEmptyOrWhitespace,
  capitalizeWords,
  debounce,
};