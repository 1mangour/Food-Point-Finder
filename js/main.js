// main.js - Search functionality with location and filters

// Wait for DOM and Supabase to be ready
document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const locationBtn = document.getElementById('locationBtn');
  const filterChips = document.querySelectorAll('.filter-chip');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent default form submission
      performSearch();
    });
  }

  // Location button functionality
  if (locationBtn) {
    locationBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleLocationSearch();
    });
  }

  // Quick filter chips functionality
  filterChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      handleQuickFilter(chip);
    });
  });

  // Perform location-based search
  async function handleLocationSearch() {
    if (!navigator.geolocation) {
      showNotification('Geolocation is not supported by your browser', 'error');
      return;
    }

    locationBtn.disabled = true;
    const icon = locationBtn.querySelector('i');
    icon.className = 'fas fa-spinner fa-spin';

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        searchInput.value = `latitude: ${latitude.toFixed(4)}, longitude: ${longitude.toFixed(4)}`;
        searchInput.placeholder = 'Searching nearby restaurants...';
        await performSearch();

        // Restore button after search completes
        locationBtn.disabled = false;
        icon.className = 'fas fa-location-crosshairs';
      },
      (error) => {
        console.error('Geolocation error:', error);
        showNotification(
          'Unable to get your location. Please allow location access.',
          'error',
        );

        // Restore button on error
        locationBtn.disabled = false;
        icon.className = 'fas fa-location-crosshairs';
      },
      { timeout: 10000 },
    );
  }

  // Handle quick filter clicks
  async function handleQuickFilter(chip) {
    const filterText = chip.textContent.trim();
    let query = '';

    switch (true) {
      case filterText.includes('Nearby'):
        await handleLocationSearch();
        return;
      case filterText.includes('Top Rated'):
        query = 'best';
        break;
      case filterText.includes('Open Now'):
        searchInput.value = 'open now';
        await performSearch();
        return;
      default:
        query = filterText;
    }

    if (query) {
      searchInput.value = query;
      await performSearch();
    }
  }

  async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      showNotification('Please enter a search term', 'info');
      return;
    }

    searchInput.disabled = true;
    const searchBtn = searchForm.querySelector('.search-btn');
    searchBtn.disabled = true;
    showNotification('Searching...', 'info', 1000);

    try {
      const supabase = window.supabaseConfig.supabase;
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,cuisine_type.ilike.%${query}%,location.ilike.%${query}%`,
        )
        .order('rating', { ascending: false });

      if (error) {
        throw error;
      }

      displaySearchResults(data);
    } catch (error) {
      console.error('Error searching restaurants:', error.message);
      showNotification(
        'Error searching restaurants. Please try again.',
        'error',
      );
      displaySearchResults([]);
    } finally {
      searchInput.disabled = false;
      searchBtn.disabled = false;
    }
  }

  // Function to display search results
  function displaySearchResults(restaurants) {
    const restaurantsGrid = document.querySelector(
      '.restaurants-grid, .restaurant-grid',
    );
    if (!restaurantsGrid) return;

    restaurantsGrid.innerHTML = '';

    if (!restaurants || restaurants.length === 0) {
      restaurantsGrid.innerHTML =
        '<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;"><h3>No restaurants found</h3><p>Try a different search term or add a new restaurant!</p></div>';
      return;
    }

    restaurants.forEach((restaurant) => {
      const card = createRestaurantCard(restaurant);
      restaurantsGrid.appendChild(card);
    });

    showNotification(
      `Found ${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''}`,
      'success',
      2000,
    );

    // Apply animations to search results
    setTimeout(() => {
      applySearchResultAnimations();
    }, 50);
  }

  // Function to create a restaurant card
  function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.style.cursor = 'pointer';

    const stars = generateStars(restaurant.rating || 0);

    // Use image_url from database, with proper fallback
    const imageUrl =
      restaurant.image_url && restaurant.image_url.trim()
        ? restaurant.image_url
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop';

    card.innerHTML = `
      <div class="restaurant-info">
        <h3 class="restaurant-name">${escapeHtml(restaurant.name)}</h3>
        <div class="restaurant-address">
          <i class="fas fa-map-marker-alt"></i>
          ${escapeHtml(restaurant.address || 'Address not available')}
        </div>
        <p class="restaurant-description">
          ${escapeHtml(restaurant.description || 'No description available')}
        </p>
        <div class="reviews-container">
          <div class="reviews-title">
            <i class="fas fa-star"></i>
            <span style="margin-left: 4px;">${stars} ${restaurant.rating ? restaurant.rating.toFixed(1) + '/5.0' : 'N/A'}</span>
          </div>
        </div>
      </div>
      <img src="${escapeHtml(imageUrl)}"
           alt="${escapeHtml(restaurant.name)}"
           class="restaurant-image"
           loading="lazy"
           data-fallback="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop">
    `;

    // Add image error handler
    const imgElement = card.querySelector('img');
    imgElement.addEventListener('error', function () {
      this.src = this.dataset.fallback;
    });

    // Add click handler to navigate to details page
    card.addEventListener('click', () => {
      window.location.href = `/pages/restaurant-details.html?id=${restaurant.id}`;
    });

    return card;
  }

  // Generate star rating display
  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    stars += '☆'.repeat(5 - Math.ceil(rating));
    return stars;
  }

  // Utility function to escape HTML and prevent XSS
  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Show notification
  function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#34a853' : type === 'error' ? '#ea4335' : '#1a73e8'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 9999;
      font-size: 13px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
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

  // Initialize animations - only for SEARCH results (not homepage featured)
  function applySearchResultAnimations() {
    const cards = document.querySelectorAll('.restaurant-card');
    const reviews = document.querySelectorAll('.review');

    cards.forEach((card, index) => {
      if (card.dataset.animated) return; // Skip if already animated
      card.dataset.animated = 'true';

      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 300);
    });

    reviews.forEach((review, index) => {
      if (review.dataset.animated) return;
      review.dataset.animated = 'true';

      review.style.opacity = '0';
      review.style.transform = 'translateX(-20px)';
      review.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

      setTimeout(
        () => {
          review.style.opacity = '1';
          review.style.transform = 'translateX(0)';
        },
        1000 + index * 200,
      );
    });

    // Review hover effects
    reviews.forEach((review) => {
      if (review.dataset.hoverApplied) return;
      review.dataset.hoverApplied = 'true';

      review.addEventListener('mouseenter', function () {
        this.style.transform = 'translateX(8px) scale(1.02)';
      });

      review.addEventListener('mouseleave', function () {
        this.style.transform = 'translateX(0) scale(1)';
      });
    });
  }
});
