// DOM utility helper functions

/**
 * Safely get elements from the DOM with error checking
 */
export function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found`);
  }
  return element;
}

/**
 * Toggle CSS class on an element
 */
export function toggleClass(element, className) {
  if (element) {
    element.classList.toggle(className);
  }
}

/**
 * Add CSS class to element
 */
export function addClass(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

/**
 * Remove CSS class from element
 */
export function removeClass(element, className) {
  if (element) {
    element.classList.remove(className);
  }
}

/**
 * Check if element has CSS class
 */
export function hasClass(element, className) {
  return element ? element.classList.contains(className) : false;
}

/**
 * Set text content safely
 */
export function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

/**
 * Set HTML content safely
 */
export function setHTML(element, html) {
  if (element) {
    element.innerHTML = html;
  }
}

/**
 * Show element
 */
export function show(element) {
  if (element) {
    element.style.display = '';
  }
}

/**
 * Hide element
 */
export function hide(element) {
  if (element) {
    element.style.display = 'none';
  }
}

/**
 * Add event listener with error handling
 */
export function addEventListener(element, event, callback) {
  if (element) {
    element.addEventListener(event, callback);
  }
}

/**
 * Remove event listener
 */
export function removeEventListener(element, event, callback) {
  if (element) {
    element.removeEventListener(event, callback);
  }
}

/**
 * Set button loading state
 */
export function setButtonLoading(button, isLoading, text = 'Loading...') {
  if (button) {
    button.disabled = isLoading;
    if (isLoading) {
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    } else {
      button.innerHTML = button.dataset.originalText || text;
    }
  }
}

/**
 * Show notification/toast message
 */
export function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#34a853' : type === 'error' ? '#ea4335' : '#1a73e8'};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    z-index: 9999;
    min-width: 250px;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  if (duration) {
    setTimeout(() => {
      notification.remove();
    }, duration);
  }

  return notification;
}

/**
 * Create skeleton loader element
 */
export function createSkeletonLoader() {
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton-loader';
  skeleton.innerHTML = `
    <div class="skeleton-image"></div>
    <div class="skeleton-title"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text" style="width: 80%;"></div>
  `;
  return skeleton;
}
