// Restaurant Details page script
(async function () {
  const container = document.getElementById('restaurant-detail');
  if (!container) return;

  function showLoading() {
    container.innerHTML =
      '<div class="loading">Loading restaurant details...</div>';
  }

  function showError(msg) {
    container.innerHTML = `<div class="error-message"><h3>Error</h3><p>${msg}</p><a href="/pages/restaurants.html" class="btn btn-primary">Back to list</a></div>`;
  }

  function renderStars(n) {
    const full = Math.floor(n || 0);
    let out = '';
    for (let i = 0; i < 5; i++)
      out += `<span class="star ${i < full ? 'filled' : 'empty'}">★</span>`;
    return out;
  }

  function renderGallery(images = []) {
    if (!images || images.length === 0) return '';
    const main = `<div class="restaurant-hero">
      <div class="hero-gallery">
        ${images
          .map(
            (src, idx) =>
              `<img src="${src}" alt="image-${idx}" class="detail-image" />`
          )
          .join('')}
      </div>
    </div>`;
    return main;
  }

  try {
    showLoading();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    let restaurant = null;
    if (id) {
      const { DatabaseHelpers } = window.supabaseConfig;
      const { data, error } = await DatabaseHelpers.getRestaurantById(id);
      if (error || !data) {
        showError('Restaurant details not found.');
        return;
      }
      restaurant = data;
    } else {
      // fallback to sessionStorage
      try {
        const stored = sessionStorage.getItem('restaurant_detail');
        if (stored) restaurant = JSON.parse(stored);
      } catch (err) {}
      if (!restaurant) {
        showError('Restaurant ID missing and no stored data found.');
        return;
      }
    }

    const images =
      restaurant.image_urls || [restaurant.image_url].filter(Boolean) || [];
    const galleryHtml = renderGallery(images);

    const cuisineTags = (restaurant.cuisine_type || '')
      .split(',')
      .map((c) => `<span class="cuisine-tag">${c.trim()}</span>`)
      .join('');

    container.innerHTML = `
      ${galleryHtml}
      <div class="restaurant-body">
        <div class="card-header">
          <h1 class="restaurant-name">${restaurant.name}</h1>
          <div class="cuisine-tags">${cuisineTags}</div>
        </div>
        <div class="card-location"><span class="location-icon">📍</span><span>${
          restaurant.location || ''
        }</span></div>
        <p class="card-description">${restaurant.description || ''}</p>
        <div class="card-ratings">
          <div class="rating-item"><span class="rating-label">Hygiene</span><div class="rating-stars">${renderStars(
            restaurant.hygiene_rating
          )}</div></div>
          <div class="rating-item"><span class="rating-label">Food</span><div class="rating-stars">${renderStars(
            restaurant.food_quality_rating
          )}</div></div>
          <div class="rating-item"><span class="rating-label">Taste</span><div class="rating-stars">${renderStars(
            restaurant.taste_rating
          )}</div></div>
          <div class="rating-item"><span class="rating-label">Ambience</span><div class="rating-stars">${renderStars(
            restaurant.ambience_rating
          )}</div></div>
        </div>
        <div class="detail-actions" style="margin-top: 16px; display:flex; gap:12px; align-items:center;">
          <button class="reserve-btn" id="reserve-btn">Reserve Table</button>
          <button class="view-btn" id="view-map">Open in Maps</button>
          <button class="btn btn-login" id="back-to-list">Back</button>
        </div>
      </div>
    `;

    // Add actions
    const reserveBtn = document.getElementById('reserve-btn');
    if (reserveBtn) {
      reserveBtn.addEventListener('click', () => {
        window.location.href = `/reservation.html?restaurantId=${restaurant.id}`;
      });
    }

    const viewMap = document.getElementById('view-map');
    if (viewMap) {
      viewMap.addEventListener('click', () => {
        if (restaurant.latitude && restaurant.longitude) {
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`
          );
        } else {
          alert('No coordinates available for this restaurant');
        }
      });
    }

    const backToList = document.getElementById('back-to-list');
    if (backToList)
      backToList.addEventListener(
        'click',
        () => (window.location.href = '/pages/restaurants.html')
      );
  } catch (err) {
    console.error(err);
    showError('Failed to load restaurant details.');
  }
})();
