async function loadTop5Restaurants() {
  const restaurantsContainer = document.querySelector('.restaurants-grid');

  if (!restaurantsContainer) {
    console.error('Restaurants container not found');
    return;
  }

  restaurantsContainer.innerHTML =
    '<div class="loading">Loading restaurants...</div>';

  try {
    const supabase = window.supabaseConfig.supabase;

    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    restaurantsContainer.innerHTML = '';

    if (restaurants && restaurants.length > 0) {
      restaurants.forEach((restaurant, index) => {
        const restaurantCard = createRestaurantCardForHomepage(restaurant);
        restaurantCard.style.opacity = '0';
        restaurantCard.style.transform = 'translateY(30px)';
        restaurantCard.style.transition =
          'opacity 0.8s ease, transform 0.8s ease';
        restaurantsContainer.appendChild(restaurantCard);

        // Stagger animation
        setTimeout(() => {
          restaurantCard.style.opacity = '1';
          restaurantCard.style.transform = 'translateY(0)';
        }, index * 100);
      });
    } else {
      restaurantsContainer.innerHTML = `
        <div class="no-restaurants" style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: #5f6368;">
          <h3>No restaurants found</h3>
          <p>Be the first to add a restaurant!</p>
          <a href="pages/add-restaurant.html" class="btn btn-signup">Add Restaurant</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading restaurants:', error);
    restaurantsContainer.innerHTML = `
      <div class="error-message" style="grid-column: 1/-1;">
        <h3>Error loading restaurants</h3>
        <p>${error.message || 'Please try again later.'}</p>
        <button class="btn btn-signup" id="retryBtn">Retry</button>
      </div>
    `;

    document
      .getElementById('retryBtn')
      .addEventListener('click', loadTop5Restaurants);
  }
}

// Helper function to create restaurant card for homepage
function createRestaurantCardForHomepage(restaurant) {
  const card = document.createElement('div');
  card.className = 'restaurant-card';
  card.style.cursor = 'pointer';

  const stars = generateStarsDisplay(restaurant.rating || 0);

  // Use image_url from database, with proper fallback
  const imageUrl =
    restaurant.image_url && restaurant.image_url.trim()
      ? restaurant.image_url
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop';

  card.innerHTML = `
    <div class="restaurant-info">
      <h3 class="restaurant-name">${escapeHtmlSafely(restaurant.name)}</h3>
      <div class="restaurant-address">
        <i class="fas fa-map-marker-alt"></i>
        ${escapeHtmlSafely(restaurant.address || 'Address not available')}
      </div>
      <p class="restaurant-description">
        ${escapeHtmlSafely(restaurant.description || 'No description available')}
      </p>
      <div class="reviews-container">
        <div class="reviews-title">
          <i class="fas fa-star"></i>
          <span style="margin-left: 4px;">${stars} ${restaurant.rating ? restaurant.rating.toFixed(1) + '/5.0' : 'N/A'}</span>
        </div>
      </div>
    </div>
    <img src="${escapeHtmlSafely(imageUrl)}"
         alt="${escapeHtmlSafely(restaurant.name)}"
         class="restaurant-image"
         loading="lazy"
         data-fallback="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop">
  `;

  // Add image error handler
  const imgElement = card.querySelector('img');
  imgElement.addEventListener('error', function () {
    this.src = this.dataset.fallback;
  });

  card.addEventListener('click', () => {
    window.location.href = `/pages/restaurant-details.html?id=${restaurant.id}`;
  });

  return card;
}

// Helper function to generate stars
function generateStarsDisplay(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '☆';
  stars += '☆'.repeat(5 - Math.ceil(rating));
  return stars;
}

// Helper function to escape HTML
function escapeHtmlSafely(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', async function () {
  if (typeof window.supabaseConfig !== 'undefined') {
    await loadTop5Restaurants();
  } else {
    console.error('Supabase config not loaded');
  }
});
