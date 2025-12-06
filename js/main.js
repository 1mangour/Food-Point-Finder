// main.js - Search functionality

// Wait for DOM and Supabase to be ready
document.addEventListener('DOMContentLoaded', function () {
  // Search functionality
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');

  if (searchInput) {
    searchInput.addEventListener('keypress', async function (e) {
      if (e.key === 'Enter') {
        await performSearch();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  async function performSearch() {
    const query = document.querySelector('.search-input').value;
    if (!query.trim()) {
      return;
    }

    try {
      const supabase = window.supabaseConfig.supabase;
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,cuisine_type.ilike.%${query}%,location.ilike.%${query}%`
        )
        .order('rating', { ascending: false });

      if (error) {
        throw error;
      }

      displaySearchResults(data);
    } catch (error) {
      console.error('Error searching restaurants:', error.message);
      displaySearchResults([]); // Show no results message
    }
  }

  // Function to display search results
  function displaySearchResults(restaurants) {
    const restaurantsGrid = document.querySelector(
      '.restaurants-grid, .restaurant-grid'
    );
    if (!restaurantsGrid) return;

    restaurantsGrid.innerHTML = ''; // Clear existing restaurants

    if (!restaurants || restaurants.length === 0) {
      restaurantsGrid.innerHTML =
        '<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No restaurants found. Try a different search term.</div>';
      return;
    }

    restaurants.forEach((restaurant) => {
      const card = createRestaurantCard(restaurant);
      restaurantsGrid.appendChild(card);
    });
  }

  // Function to create a restaurant card
  function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';

    card.innerHTML = `
            <div class="restaurant-info">
                <h3 class="restaurant-name">${escapeHtml(restaurant.name)}</h3>
                <div class="restaurant-address">
                    <i class="fas fa-map-marker-alt"></i>
                    ${escapeHtml(restaurant.address || 'Address not available')}
                </div>
                <p class="restaurant-description">
                    ${escapeHtml(
                      restaurant.description || 'No description available'
                    )}
                </p>
                <div class="reviews-container">
                    <div class="reviews-title">
                        <i class="fas fa-star"></i>
                        Rating: ${
                          restaurant.rating
                            ? restaurant.rating.toFixed(1)
                            : 'N/A'
                        } / 5.0
                    </div>
                </div>
            </div>
            <img src="${escapeHtml(
              restaurant.image_url || '/assets/images/default-restaurant.jpg'
            )}" 
                 alt="${escapeHtml(restaurant.name)}" 
                 class="restaurant-image"
                 onerror="this.src='/assets/images/default-restaurant.jpg'">
        `;

    return card;
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

  // Initialize animations
  const cards = document.querySelectorAll('.restaurant-card');
  const reviews = document.querySelectorAll('.review');

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 300);
  });

  reviews.forEach((review, index) => {
    review.style.opacity = '0';
    review.style.transform = 'translateX(-20px)';
    review.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(() => {
      review.style.opacity = '1';
      review.style.transform = 'translateX(0)';
    }, 1000 + index * 200);
  });

  // Review hover effects
  document.querySelectorAll('.review').forEach((review) => {
    review.addEventListener('mouseenter', function () {
      this.style.transform = 'translateX(8px) scale(1.02)';
    });

    review.addEventListener('mouseleave', function () {
      this.style.transform = 'translateX(0) scale(1)';
    });
  });
});
