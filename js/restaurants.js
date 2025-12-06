// FIXED: Remove duplicate code and add real Supabase integration for dynamic content

// Pagination configuration
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let totalRestaurants = 0;

// FIXED: Dynamic restaurant loading from Supabase with pagination
async function loadRestaurants(page = 1) {
  const { DatabaseHelpers, UIHelpers } = window.supabaseConfig;
  const restaurantsContainer = document.querySelector(
    '.restaurants-grid, .restaurant-grid'
  );

  if (!restaurantsContainer) {
    console.error('Restaurants container not found');
    return;
  }

  currentPage = page;

  // Show loading state
  restaurantsContainer.innerHTML =
    '<div class="loading">Loading restaurants...</div>';

  try {
    // FIXED: Fetch restaurants from Supabase database with pagination
    const supabase = window.supabaseConfig.supabase;
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    // Get total count
    const { count: totalCount } = await supabase
      .from('restaurants')
      .select('id', { count: 'exact', head: true });
    totalRestaurants = totalCount || 0;

    // Get paginated data
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      throw error;
    }

    // FIXED: Clear loading and display restaurants
    // Clear any existing gallery intervals to avoid leaks when clearing NODES
    clearGalleryIntervals(restaurantsContainer);
    restaurantsContainer.innerHTML = '';

    if (restaurants && restaurants.length > 0) {
      restaurants.forEach((restaurant, index) => {
        const restaurantCard = createRestaurantCard(restaurant);
        restaurantCard.style.animationDelay = `${index * 0.1}s`;
        restaurantsContainer.appendChild(restaurantCard);
      });

      // Initialize scroll animations for new cards
      initializeScrollAnimations();

      // Add pagination controls
      createPaginationControls(totalRestaurants, page);
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

// Create pagination controls
function createPaginationControls(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalPages <= 1) return; // No pagination needed

  let paginationHtml =
    '<div class="pagination" style="display: flex; justify-content: center; gap: 10px; margin-top: 40px; padding: 20px;">';

  // Previous button
  if (currentPage > 1) {
    paginationHtml += `<button onclick="loadRestaurants(${
      currentPage - 1
    })" class="btn btn-outline" style="padding: 8px 16px;">← Previous</button>`;
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHtml += `<button class="btn btn-primary" style="padding: 8px 16px; background: #1a73e8; color: white;">${i}</button>`;
    } else if (i <= currentPage + 2 && i >= currentPage - 2) {
      paginationHtml += `<button onclick="loadRestaurants(${i})" class="btn btn-outline" style="padding: 8px 16px;">${i}</button>`;
    }
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHtml += `<button onclick="loadRestaurants(${
      currentPage + 1
    })" class="btn btn-outline" style="padding: 8px 16px;">Next →</button>`;
  }

  paginationHtml += '</div>';

  const restaurantsContainer = document.querySelector(
    '.restaurants-grid, .restaurant-grid'
  );
  restaurantsContainer.parentElement.insertAdjacentHTML(
    'afterend',
    paginationHtml
  );
}

// FIXED: Create restaurant card dynamically
function createRestaurantCard(restaurant) {
  const card = document.createElement('div');
  card.className = 'restaurant-card';

  // Get image URLs array
  const images =
    restaurant.image_urls && restaurant.image_urls.length > 0
      ? restaurant.image_urls
      : ['https://via.placeholder.com/800x600/cccccc/666666?text=No+Image'];
  const imageUrl = images[0];

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

  // Generate cuisine tags (split by comma) and star spans
  const cuisineTags = (restaurant.cuisine_type || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  const cuisineTagsHtml = cuisineTags
    .map((c) => `<span class="cuisine-tag">${c}</span>`)
    .join('');

  const generateStarSpans = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let out = '';
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) out += '<span class="star filled">★</span>';
      else out += '<span class="star empty">★</span>';
    }
    return out;
  };

  const verifiedBadge = restaurant.verified
    ? `<span class="badge badge-verified">✓ Verified</span>`
    : '';
  const ratingBadgeHtml = `<span class="rating-badge"><span class="star-icon">⭐</span> ${
    restaurant.overall_rating || '—'
  }</span>`;
  const expenseTagText = `${restaurant.price_range || ''} ${
    priceRangeText || ''
  }`.trim();
  const expenseTagHtml = expenseTagText
    ? `<span class="expense-tag">${expenseTagText}</span>`
    : '';

  card.innerHTML = `
    <div class="card-image-wrapper">
      ${ratingBadgeHtml}
      <img src="${imageUrl}" alt="${
    restaurant.name
  }" class="card-main-image" onerror="this.src='https://via.placeholder.com/800x600/cccccc/666666?text=No+Image'" />
      <div class="card-badges">
        ${verifiedBadge}
      </div>
      <button class="favorite-btn" aria-label="favorite">
        <svg class="favorite-icon" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>
      ${
        images.length > 1
          ? `<div class="image-gallery-dots">${images
              .map(
                (img, idx) =>
                  `<span class="gallery-dot${
                    idx === 0 ? ' active' : ''
                  }" data-index="${idx}"></span>`
              )
              .join('')}</div>`
          : ''
      }
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="restaurant-name">${restaurant.name}</h3>
        <div class="cuisine-tags">${cuisineTagsHtml}</div>
      </div>
      <div class="card-location"><span class="location-icon">📍</span> <span>${
        restaurant.location
      }</span></div>
      <p class="card-description">${restaurant.description || ''}</p>
      <div class="card-ratings">
        <div class="rating-item"><span class="rating-label">Hygiene</span><div class="rating-stars">${generateStarSpans(
          restaurant.hygiene_rating || 0
        )}</div></div>
        <div class="rating-item"><span class="rating-label">Food Quality</span><div class="rating-stars">${generateStarSpans(
          restaurant.food_quality_rating || 0
        )}</div></div>
        <div class="rating-item"><span class="rating-label">Taste</span><div class="rating-stars">${generateStarSpans(
          restaurant.taste_rating || 0
        )}</div></div>
        <div class="rating-item"><span class="rating-label">Ambience</span><div class="rating-stars">${generateStarSpans(
          restaurant.ambience_rating || 0
        )}</div></div>
      </div>
      <div class="card-footer">
        <div class="footer-left"><span class="added-by">${
          restaurant.added_by_email || ''
        }</span><span class="added-date">${
    restaurant.created_at
      ? new Date(restaurant.created_at).toLocaleDateString()
      : ''
  }</span></div>
        <div class="footer-right"><button class="view-btn" data-restaurant-id="${
          restaurant.id
        }">View Details</button>${expenseTagHtml}</div>
      </div>
    </div>
  `;

  // Favorite button logic
  const favBtn = card.querySelector('.favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      favBtn.classList.toggle('active');
      // Optionally: persist favorite state with localStorage
      const favKey = `fav_${restaurant.id}`;
      const isFav = favBtn.classList.contains('active');
      try {
        localStorage.setItem(favKey, isFav ? '1' : '0');
      } catch (err) {}
    });
    try {
      const favKey = `fav_${restaurant.id}`;
      if (localStorage.getItem(favKey) === '1') favBtn.classList.add('active');
    } catch (err) {}
  }

  // Click anywhere on the card to go to details (ignore button/link clicks)
  card.addEventListener('click', function (e) {
    if (
      e.target.closest('.favorite-btn') ||
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('.view-btn')
    )
      return;
    // save data in sessionStorage as a fallback and then navigate to detail page
    try {
      sessionStorage.setItem('restaurant_detail', JSON.stringify(restaurant));
    } catch (err) {}
    console.debug('navigate: restaurant id', restaurant.id);
    window.location.href = `/pages/R_details_page.html?id=${restaurant.id}`;
  });

  // Attach View Details button listener (avoid inline onclick to improve maintainability)
  const viewBtnEl = card.querySelector('.view-btn');
  if (viewBtnEl) {
    viewBtnEl.addEventListener('click', function (e) {
      e.stopPropagation();
      const id = this.getAttribute('data-restaurant-id') || restaurant.id;
      console.debug('view-btn click, id', id);
      window.location.href = `/pages/R_details_page.html?id=${id}`;
    });
  }

  // Image gallery dots switching + autoplay/swipe
  const galleryDots = card.querySelectorAll('.gallery-dot');
  if (galleryDots.length > 0) {
    galleryDots.forEach((dot) => {
      dot.addEventListener('click', function (e) {
        const idx = parseInt(this.getAttribute('data-index'));
        // use changeImage to handle fade and autoplay restart
        changeImage(idx);
      });
    });

    // Autoplay: rotate images every 4s
    const mainImg = card.querySelector('.card-main-image');
    card._galleryImages = images;
    card._currentGalleryIndex = 0;
    // make first dot active
    if (galleryDots.length > 0) {
      galleryDots.forEach((d) => d.classList.remove('active'));
      const firstDot = card.querySelector('.gallery-dot[data-index="0"]');
      if (firstDot) firstDot.classList.add('active');
    }

    const changeImage = (i) => {
      const idx = Number(i);
      if (!mainImg || idx === card._currentGalleryIndex) return;
      const newSrc = images[idx];
      // fade: reduce opacity, change src, then restore opacity on load
      mainImg.style.opacity = '0';
      const onload = () => {
        mainImg.removeEventListener('load', onload);
        mainImg.style.opacity = '1';
      };
      mainImg.addEventListener('load', onload);
      setTimeout(() => {
        mainImg.src = newSrc;
      }, 120);
      // update dots
      galleryDots.forEach((d) => d.classList.remove('active'));
      const activeDot = card.querySelector(`.gallery-dot[data-index="${idx}"]`);
      if (activeDot) activeDot.classList.add('active');
      card._currentGalleryIndex = idx;
    };

    const nextImage = () =>
      changeImage((card._currentGalleryIndex + 1) % images.length);
    const prevImage = () =>
      changeImage(
        (card._currentGalleryIndex - 1 + images.length) % images.length
      );

    function startGalleryAuto() {
      // clear existing
      if (card._galleryIntervalId) clearInterval(card._galleryIntervalId);
      card._galleryIntervalId = setInterval(nextImage, 4000);
    }
    function stopGalleryAuto() {
      if (card._galleryIntervalId) {
        clearInterval(card._galleryIntervalId);
        delete card._galleryIntervalId;
      }
    }

    // Start autoplay
    startGalleryAuto();

    // Pause on hover & resume
    card.addEventListener('mouseenter', stopGalleryAuto);
    card.addEventListener('mouseleave', startGalleryAuto);

    // Restart autoplay on manual interactions
    galleryDots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-index'));
        changeImage(idx);
        stopGalleryAuto();
        // restart after a short delay so users see the change
        setTimeout(startGalleryAuto, 3000);
      });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    mainImg.addEventListener('touchstart', (e) => {
      stopGalleryAuto();
      touchStartX = e.changedTouches[0].screenX;
    });
    mainImg.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextImage();
        else prevImage();
      }
      // resume autoplay shortly after interaction
      setTimeout(startGalleryAuto, 2500);
    });
  }

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

// Clear gallery intervals for all cards inside a container (to prevent leaks)
function clearGalleryIntervals(container) {
  if (!container) return;
  container.querySelectorAll('.restaurant-card').forEach((card) => {
    if (card._galleryIntervalId) {
      clearInterval(card._galleryIntervalId);
      delete card._galleryIntervalId;
    }
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
      '.restaurants-grid, .restaurant-grid'
    );
    if (!restaurantsContainer) return;

    // Clear any existing gallery intervals before clearing the container
    clearGalleryIntervals(restaurantsContainer);
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
