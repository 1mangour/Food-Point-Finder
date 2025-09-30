// FIXED: Remove duplicate code and add real Supabase integration for dynamic content

// FIXED: Dynamic restaurant loading from Supabase
async function loadRestaurants() {
  const { DatabaseHelpers, UIHelpers } = window.supabaseConfig;
  const restaurantsContainer = document.querySelector('.restaurants-grid');

  if (!restaurantsContainer) {
    console.error('Restaurants container not found');
    return;
  }

  // Show loading state
  restaurantsContainer.innerHTML =
    '<div class="loading">Loading restaurants...</div>';

  try {
    // FIXED: Fetch restaurants from Supabase database
    const { data: restaurants, error } =
      await DatabaseHelpers.getAllRestaurants();

    if (error) {
      throw error;
    }

    // FIXED: Clear loading and display restaurants
    restaurantsContainer.innerHTML = '';

    if (restaurants && restaurants.length > 0) {
      restaurants.forEach((restaurant, index) => {
        const restaurantCard = createRestaurantCard(restaurant);
        restaurantCard.style.animationDelay = `${index * 0.1}s`;
        restaurantsContainer.appendChild(restaurantCard);
      });

      // Initialize scroll animations for new cards
      initializeScrollAnimations();
    } else {
      restaurantsContainer.innerHTML = `
                <div class="no-restaurants">
                    <h3>No restaurants found</h3>
                    <p>Be the first to add a restaurant!</p>
                    <a href="add-restaurant.html" class="btn btn-primary">Add Restaurant</a>
                </div>
            `;
    }
  } catch (error) {
    console.error('Error loading restaurants:', error);
    restaurantsContainer.innerHTML = `
            <div class="error-message">
                <h3>Error loading restaurants</h3>
                <p>Please try again later.</p>
                <button onclick="loadRestaurants()" class="btn btn-primary">Retry</button>
            </div>
        `;
  }
}

// FIXED: Create restaurant card dynamically
function createRestaurantCard(restaurant) {
  const card = document.createElement('div');
  card.className = 'restaurant-card';

  // Get first image URL or use placeholder
  const imageUrl =
    restaurant.image_urls && restaurant.image_urls.length > 0
      ? restaurant.image_urls[0]
      : 'https://via.placeholder.com/300x200/cccccc/666666?text=No+Image';

  // Format price range
  const priceRangeMap = {
    $: 'Inexpensive',
    $$: 'Moderate',
    $$$: 'Expensive',
    $$$$: 'Very Expensive',
  };
  const priceRangeText =
    priceRangeMap[restaurant.price_range] || restaurant.price_range;

  // Generate star rating HTML
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }

    return starsHtml;
  };

  card.innerHTML = `
        <div class="restaurant-image">
            <img src="${imageUrl}" alt="${
    restaurant.name
  }" onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=No+Image'">
            <div class="restaurant-badge">${restaurant.cuisine_type}</div>
        </div>
        <div class="restaurant-info">
            <div class="restaurant-header">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <div class="restaurant-rating">
                    <div class="stars">
                        ${generateStars(restaurant.overall_rating)}
                    </div>
                    <span class="rating-number">${
                      restaurant.overall_rating
                    }</span>
                </div>
            </div>
            <div class="restaurant-details">
                <p class="restaurant-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${restaurant.location}
                </p>
                <p class="restaurant-price">
                    <i class="fas fa-dollar-sign"></i>
                    ${priceRangeText}
                </p>
            </div>
            <p class="restaurant-description">${restaurant.description}</p>
            <div class="restaurant-ratings">
                <div class="rating-item">
                    <span class="rating-label">Hygiene:</span>
                    <div class="rating-stars">${generateStars(
                      restaurant.hygiene_rating
                    )}</div>
                </div>
                <div class="rating-item">
                    <span class="rating-label">Food Quality:</span>
                    <div class="rating-stars">${generateStars(
                      restaurant.food_quality_rating
                    )}</div>
                </div>
                <div class="rating-item">
                    <span class="rating-label">Taste:</span>
                    <div class="rating-stars">${generateStars(
                      restaurant.taste_rating
                    )}</div>
                </div>
                <div class="rating-item">
                    <span class="rating-label">Ambience:</span>
                    <div class="rating-stars">${generateStars(
                      restaurant.ambience_rating
                    )}</div>
                </div>
            </div>
            <div class="restaurant-footer">
                <small class="added-by">Added by: ${
                  restaurant.added_by_email
                }</small>
                <small class="added-date">${new Date(
                  restaurant.created_at
                ).toLocaleDateString()}</small>
            </div>
        </div>
    `;

  return card;
}

// FIXED: Initialize scroll animations for restaurant cards
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all restaurant cards
  document.querySelectorAll('.restaurant-card').forEach((card) => {
    observer.observe(card);
  });
}

// FIXED: Enhanced search and filter functionality
function initializeSearchAndFilters() {
  const searchInput = document.getElementById('restaurant-search');
  const cuisineFilter = document.getElementById('cuisine-filter');
  const priceFilter = document.getElementById('price-filter');

  let allRestaurants = [];

  // Store all restaurants for filtering
  const { DatabaseHelpers } = window.supabaseConfig;
  DatabaseHelpers.getAllRestaurants().then(({ data }) => {
    if (data) allRestaurants = data;
  });

  function filterRestaurants() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCuisine = cuisineFilter ? cuisineFilter.value : '';
    const selectedPrice = priceFilter ? priceFilter.value : '';

    const filteredRestaurants = allRestaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.location.toLowerCase().includes(searchTerm) ||
        restaurant.description.toLowerCase().includes(searchTerm);
      const matchesCuisine =
        !selectedCuisine || restaurant.cuisine_type === selectedCuisine;
      const matchesPrice =
        !selectedPrice || restaurant.price_range === selectedPrice;

      return matchesSearch && matchesCuisine && matchesPrice;
    });

    displayFilteredRestaurants(filteredRestaurants);
  }

  function displayFilteredRestaurants(restaurants) {
    const restaurantsContainer = document.querySelector(
      '.restaurants-grid'
    );
    if (!restaurantsContainer) return;

    restaurantsContainer.innerHTML = '';

    if (restaurants.length > 0) {
      restaurants.forEach((restaurant, index) => {
        const restaurantCard = createRestaurantCard(restaurant);
        restaurantCard.style.animationDelay = `${index * 0.1}s`;
        restaurantsContainer.appendChild(restaurantCard);
      });
      initializeScrollAnimations();
    } else {
      restaurantsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No restaurants found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
    }
  }

  // Add event listeners
  if (searchInput) {
    searchInput.addEventListener('input', filterRestaurants);
  }
  if (cuisineFilter) {
    cuisineFilter.addEventListener('change', filterRestaurants);
  }
  if (priceFilter) {
    priceFilter.addEventListener('change', filterRestaurants);
  }
}

// FIXED: Real-time updates using Supabase subscriptions
function setupRealtimeUpdates() {
  const { supabase } = window.supabaseConfig;

  // Subscribe to restaurant table changes
  const subscription = supabase
    .channel('restaurants-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'restaurants',
      },
      (payload) => {
        console.log('Restaurant data changed:', payload);
        // Reload restaurants when data changes
        loadRestaurants();
      }
    )
    .subscribe();

  // Clean up subscription when page unloads
  window.addEventListener('beforeunload', () => {
    supabase.removeChannel(subscription);
  });
}

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollTop = scrollTop;
});

// FIXED: Initialize everything when page loads
document.addEventListener('DOMContentLoaded', async function () {
  // Wait for supabase config to load
  if (typeof window.supabaseConfig !== 'undefined') {
    // Load restaurants from database
    await loadRestaurants();

    // Initialize search and filters
    initializeSearchAndFilters();

    // Setup real-time updates
    setupRealtimeUpdates();

    // Check authentication state and update UI
    const { AuthHelpers } = window.supabaseConfig;
    try {
      const isAuthenticated = await AuthHelpers.isAuthenticated();
      const currentUser = await AuthHelpers.getCurrentUser();

      // Update UI based on auth state
      const authButtons = document.querySelector('.auth-buttons');
      if (authButtons && isAuthenticated && currentUser) {
        // Show user menu instead of login/signup buttons
        authButtons.innerHTML = `
                    <span class="user-greeting">Hello, ${currentUser.email}</span>
                    <button onclick="window.supabaseConfig.AuthHelpers.signOut()" class="btn btn-outline">Logout</button>
                `;
      }
    } catch (error) {
      console.error('Auth state check error:', error);
    }
  } else {
    console.error('Supabase config not loaded');
  }
});
