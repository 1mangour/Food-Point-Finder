// Form validation utility functions

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate phone format (basic)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validate required field
 */
export function isNotEmpty(value) {
  return value && value.trim().length > 0;
}

/**
 * Validate text length
 */
export function isValidLength(value, minLength = 1, maxLength = Infinity) {
  const length = value.trim().length;
  return length >= minLength && length <= maxLength;
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Validate rating value
 */
export function isValidRating(rating) {
  const num = parseFloat(rating);
  return !isNaN(num) && num >= 1 && num <= 5;
}

/**
 * Validate form and show errors
 */
export function validateForm(formElement, validationRules) {
  const errors = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const field = formElement.elements[fieldName];
    if (!field) continue;

    const value = field.value;

    for (const rule of rules) {
      if (!rule.check(value)) {
        if (!errors[fieldName]) {
          errors[fieldName] = [];
        }
        errors[fieldName].push(rule.message);
        isValid = false;
      }
    }
  }

  return { isValid, errors };
}

/**
 * Show field validation error
 */
export function showFieldError(field, errorMessage) {
  field.classList.add('error');
  field.style.borderColor = '#ea4335';

  // Create or update error message element
  let errorElement = field.parentElement.querySelector('.field-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    field.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = errorMessage;
}

/**
 * Clear field validation error
 */
export function clearFieldError(field) {
  field.classList.remove('error');
  field.style.borderColor = '';

  const errorElement = field.parentElement.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
}

/**
 * Clear all form errors
 */
export function clearFormErrors(formElement) {
  formElement.querySelectorAll('.error').forEach((field) => {
    clearFieldError(field);
  });
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (message = 'This field is required') => ({
    check: (value) => isNotEmpty(value),
    message,
  }),

  email: (message = 'Invalid email address') => ({
    check: (value) => !value || isValidEmail(value), // Empty is ok if not required
    message,
  }),

  phone: (message = 'Invalid phone number') => ({
    check: (value) => !value || isValidPhone(value),
    message,
  }),

  minLength: (length, message = `Minimum ${length} characters required`) => ({
    check: (value) => !value || value.length >= length,
    message,
  }),

  maxLength: (length, message = `Maximum ${length} characters allowed`) => ({
    check: (value) => !value || value.length <= length,
    message,
  }),

  url: (message = 'Invalid URL') => ({
    check: (value) => !value || isValidUrl(value),
    message,
  }),

  rating: (message = 'Rating must be between 1 and 5') => ({
    check: (value) => !value || isValidRating(value),
    message,
  }),
};
