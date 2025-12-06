// # CORRECTED ADD-RESTAURANT.JS - Full Supabase Integration
// FIXED: Remove duplicate functions and add proper Supabase integration

// FIXED: Single handleSubmit function with full Supabase integration
async function handleSubmit(event) {
  event.preventDefault();

  // FIXED: Check authentication before allowing restaurant submission
  const { AuthHelpers, DatabaseHelpers, UIHelpers } = window.supabaseConfig;

  const isAuth = await AuthHelpers.requireAuth();
  if (!isAuth) {
    UIHelpers.showError('Please log in to add a restaurant');
    return;
  }

  // Clear previous messages
  UIHelpers.showError('', 'error-message');
  UIHelpers.showSuccess('', 'success-message');

  // Get current user
  const currentUser = await AuthHelpers.getCurrentUser();

  // Get form data
  const formData = new FormData(event.target);
  const restaurantName = formData.get('restaurantName');
  const location = formData.get('location');
  const description = formData.get('description');
  const hygieneRating = formData.get('hygieneRating');
  const foodQuality = formData.get('qualityRating');
  const taste = formData.get('tasteRating');
  const ambience = formData.get('ambienceRating');
  const cuisineType = formData.get('cuisine');
  const priceRange = formData.get('priceRange');
  const imageFiles = formData.getAll('images');
  const uploadMethod = formData.get('uploadMethod') || 'file';
  const imageUrlsText = formData.get('imageUrls');

  // FIXED: Form validation
  if (
    !restaurantName ||
    !location ||
    !description ||
    !cuisineType ||
    !priceRange ||
    priceRange === ''
  ) {
    UIHelpers.showError('Please fill in all required fields');
    return;
  }

  if (!hygieneRating || !foodQuality || !taste || !ambience) {
    UIHelpers.showError('Please provide all ratings');
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Adding Restaurant...';
  submitBtn.disabled = true;

  try {
    // Process images based on upload method
    const imageUrls = [];

    if (uploadMethod === 'file' && imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file && file.size && file.type && file.type.startsWith('image/')) {
          const { data: imageUrl, error: uploadError } =
            await DatabaseHelpers.uploadImage(file);
          if (uploadError) {
            console.error('Image upload error:', uploadError);
          } else {
            imageUrls.push(imageUrl);
          }
        }
      }
    } else if (uploadMethod === 'url' && imageUrlsText) {
      const urls = imageUrlsText
        .split('\n')
        .map((u) => u.trim())
        .filter(Boolean);
      // Validate recommended 2-3 images
      if (urls.length < 2 || urls.length > 3) {
        UIHelpers.showError('Please provide between 2 and 3 image URLs.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }

      for (const url of urls) {
        try {
          // Try fetching the image and uploading it to Supabase storage
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed to fetch');
          const blob = await response.blob();
          const filename = (url.split('/').pop() || 'image') + Date.now();
          const file = new File([blob], filename, {
            type: blob.type || 'image/jpeg',
          });
          const { data: uploaded, error: uploadError } =
            await DatabaseHelpers.uploadImage(file);
          if (uploadError || !uploaded) {
            // Fallback: store the external URL directly if upload fails
            imageUrls.push(url);
          } else {
            imageUrls.push(uploaded);
          }
        } catch (err) {
          // Fallback if fetch or upload is blocked by CORS etc.
          console.warn(
            'Could not import URL image to storage, keeping external reference:',
            url,
            err
          );
          imageUrls.push(url);
        }
      }
    }

    // FIXED: Calculate average rating
    const totalRating =
      (parseInt(hygieneRating) +
        parseInt(foodQuality) +
        parseInt(taste) +
        parseInt(ambience)) /
      4;

    // FIXED: Prepare restaurant data for database
    const restaurantData = {
      name: restaurantName,
      location: location,
      description: description,
      cuisine_type: cuisineType,
      price_range: priceRange,
      hygiene_rating: parseInt(hygieneRating),
      food_quality_rating: parseInt(foodQuality),
      taste_rating: parseInt(taste),
      ambience_rating: parseInt(ambience),
      overall_rating: Math.round(totalRating * 10) / 10, // Round to 1 decimal
      image_urls: imageUrls,
      added_by: currentUser.id,
      added_by_email: currentUser.email,
      created_at: new Date().toISOString(),
    };

    // FIXED: Insert restaurant data into Supabase database
    const { data, error } = await DatabaseHelpers.insertRestaurant(
      restaurantData
    );

    if (error) {
      console.error('Database error:', error);
      UIHelpers.showError('Failed to add restaurant. Please try again.');
    } else {
      UIHelpers.showSuccess('Restaurant added successfully! Redirecting...');

      // FIXED: Clear form after successful submission
      event.target.reset();

      // Reset star ratings visual state
      document.querySelectorAll('.rating-stars label').forEach((label) => {
        label.style.color = '#dadce0';
      });

      // Redirect to restaurants page
      setTimeout(() => {
        window.location.href = 'restaurants.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Restaurant submission error:', error);
    UIHelpers.showError('An unexpected error occurred. Please try again.');
  } finally {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// FIXED: Enhanced image upload preview
document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('imageFiles');

  if (imageInput) {
    imageInput.addEventListener('change', function (event) {
      const files = event.target.files;
      const uploadText = document.querySelector('.image-upload p');
      const previewContainer = document.getElementById('imagePreviewContainer');
      const grid = document.getElementById('imagePreviewGrid');

      if (files.length > 0) {
        if (uploadText)
          uploadText.textContent = `${files.length} image(s) selected`;

        // FIXED: Show image previews
        if (previewContainer) {
          grid.innerHTML = '';

          Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.style.margin = '5px';
                img.style.borderRadius = '8px';
                grid.appendChild(img);
                previewContainer.style.display = 'block';
              };
              reader.readAsDataURL(file);
            }
          });
        }
      } else {
        if (uploadText)
          uploadText.textContent = 'Click to upload restaurant images';
        if (previewContainer) {
          grid.innerHTML = '';
          previewContainer.style.display = 'none';
        }
      }
    });
  }
});

// Switch between URL and File upload methods
function switchUploadMethod(method) {
  const urlSection = document.getElementById('urlUploadSection');
  const fileSection = document.getElementById('fileUploadSection');
  const urlBtn = document.querySelector(
    '.upload-method-tabs .tab-btn:nth-child(1)'
  );
  const fileBtn = document.querySelector(
    '.upload-method-tabs .tab-btn:nth-child(2)'
  );
  const uploadMethodInput = document.getElementById('uploadMethod');

  if (method === 'url') {
    urlSection.style.display = 'block';
    fileSection.style.display = 'none';
    urlBtn.classList.add('active');
    fileBtn.classList.remove('active');
    if (uploadMethodInput) uploadMethodInput.value = 'url';
  } else {
    urlSection.style.display = 'none';
    fileSection.style.display = 'block';
    urlBtn.classList.remove('active');
    fileBtn.classList.add('active');
    if (uploadMethodInput) uploadMethodInput.value = 'file';
  }
}

// Preview images from URLs (textarea)
function previewUrlImages() {
  const uploadMethodInput = document.getElementById('uploadMethod');
  if (uploadMethodInput) uploadMethodInput.value = 'url';
  const textarea = document.getElementById('imageUrls');
  const previewContainer = document.getElementById('imagePreviewContainer');
  const grid = document.getElementById('imagePreviewGrid');
  grid.innerHTML = '';
  const urls = (textarea.value || '')
    .split('\n')
    .map((u) => u.trim())
    .filter(Boolean);
  if (urls.length === 0) {
    previewContainer.style.display = 'none';
    return;
  }

  urls.forEach((url) => {
    try {
      const img = document.createElement('img');
      img.src = url;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.margin = '5px';
      img.style.borderRadius = '8px';
      grid.appendChild(img);
      previewContainer.style.display = 'block';
    } catch (err) {
      console.warn('Invalid image URL:', url, err);
    }
  });
}

// Preview images for file input
function previewFileImages() {
  const uploadMethodInput = document.getElementById('uploadMethod');
  if (uploadMethodInput) uploadMethodInput.value = 'file';
  const input = document.getElementById('imageFiles');
  const previewContainer = document.getElementById('imagePreviewContainer');
  const grid = document.getElementById('imagePreviewGrid');
  grid.innerHTML = '';
  if (!input || !input.files || input.files.length === 0) {
    previewContainer.style.display = 'none';
    return;
  }

  Array.from(input.files).forEach((file) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.margin = '5px';
      img.style.borderRadius = '8px';
      grid.appendChild(img);
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
}

// FIXED: Enhanced star rating interaction
document.querySelectorAll('.rating-stars').forEach((ratingGroup) => {
  const labels = ratingGroup.querySelectorAll('label');
  const inputs = ratingGroup.querySelectorAll('input');

  labels.forEach((label, labelIndex) => {
    label.addEventListener('mouseover', function () {
      const value = this.previousElementSibling.value;

      labels.forEach((l, i) => {
        if (i >= labels.length - value) {
          l.style.color = '#fbbc05';
        } else {
          l.style.color = '#dadce0';
        }
      });
    });

    label.addEventListener('click', function () {
      const input = this.previousElementSibling;
      input.checked = true;
    });
  });

  ratingGroup.addEventListener('mouseleave', function () {
    const checkedInput = this.querySelector('input:checked');

    labels.forEach((label) => {
      label.style.color = '#dadce0';
    });

    if (checkedInput) {
      const value = checkedInput.value;
      labels.forEach((label, i) => {
        if (i >= labels.length - value) {
          label.style.color = '#fbbc05';
        }
      });
    }
  });
});

// FIXED: Check authentication on page load
document.addEventListener('DOMContentLoaded', async function () {
  if (typeof window.supabaseConfig !== 'undefined') {
    const { AuthHelpers } = window.supabaseConfig;

    try {
      const isAuthenticated = await AuthHelpers.isAuthenticated();
      const currentUser = await AuthHelpers.getCurrentUser();

      const authButtons = document.querySelector('.auth-buttons');
      if (authButtons && isAuthenticated && currentUser) {
        authButtons.innerHTML = `
                    <span class="user-greeting">Hello, ${currentUser.email}</span>
                    <button onclick="window.supabaseConfig.AuthHelpers.signOut()" class="btn btn-outline">Logout</button>
                `;
      } else {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
      }
    } catch (error) {
      console.error('Auth check error:', error);
      window.location.href = 'login.html';
    }
  }
});
