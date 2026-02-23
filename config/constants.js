// Constants for the Food Point Finder application

// Database table names
export const DB_TABLES = {
  RESTAURANTS: 'restaurants',
  FEEDBACK: 'feedback',
  REVIEWS: 'reviews',
  USERS: 'user_profiles',
};

// Storage buckets
export const STORAGE_BUCKETS = {
  RESTAURANT_IMAGES: 'restaurant-images',
};

// URL configuration
export const URLS = {
  HOME: '/index.html',
  LOGIN: '/pages/login.html',
  SIGNUP: '/pages/signup.html',
  RESTAURANTS: '/pages/restaurants.html',
  ADD_RESTAURANT: '/pages/add-restaurant.html',
  CONTACT: '/pages/contact.html',
  RESTAURANT_DETAILS: '/pages/restaurant-details.html',
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: '/',
};

// Validation patterns
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  // Add more validation patterns as needed
};

// Image defaults
export const IMAGES = {
  DEFAULT_PLACEHOLDER: 'https://via.placeholder.com/400x600?text=No+Image',
  FALLBACK_SIZE: '400x600',
  QUALITY: 'crop',
};

// Pagination defaults
export const PAGINATION = {
  INITIAL_LOAD: 12,
  PAGE_SIZE: 12,
  HOME_PAGE_SIZE: 5,
};

// UI Messages
export const MESSAGES = {
  ERROR: {
    LOADING_RESTAURANTS: 'Error loading restaurants. Please try again.',
    SUBMITTING_FEEDBACK: 'Error submitting feedback. Please try again.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    REQUIRED_FIELD: 'This field is required.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
  },
  SUCCESS: {
    FEEDBACK_SUBMITTED: 'Thank you! Your feedback has been submitted.',
    RESTAURANT_ADDED: 'Restaurant added successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
  },
};

// CSS Classes
export const CSS_CLASSES = {
  ACTIVE: 'active',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  HIDDEN: 'hidden',
  DISABLED: 'disabled',
};
