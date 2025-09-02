// Add restaurant form submission handler
function handleSubmit(event) {
  event.preventDefault();

  // Collect form data
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  // Here you would typically send the data to your backend
  console.log('Restaurant data:', data);
}

// Image upload preview
document
  .getElementById('imageInput')
  ?.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Add your image preview logic here
        const preview = document.getElementById('imagePreview');
        if (preview) {
          preview.src = e.target.result;
          preview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    }
  });

// Star rating interaction
document.querySelectorAll('.rating-stars label').forEach((star) => {
  star.addEventListener('click', function () {
    // Add your rating logic here
  });
});

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const toggleButton = document.querySelector('.mobile-menu-toggle i');

  mobileMenu.classList.toggle('active');

  if (mobileMenu.classList.contains('active')) {
    toggleButton.classList.remove('fa-bars');
    toggleButton.classList.add('fa-times');
  } else {
    toggleButton.classList.remove('fa-times');
    toggleButton.classList.add('fa-bars');
  }
}

// Form submission handler
function handleSubmit(event) {
  event.preventDefault();

  // Collect form data
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  // Here you would typically send the data to your backend
  console.log('Restaurant Data:', data);
  alert('Restaurant added successfully! (Demo only)');

  // Optionally redirect to restaurants page
  // window.location.href = 'restaurants.html';
}

// Image upload preview
document
  .getElementById('imageInput')
  .addEventListener('change', function (event) {
    const files = event.target.files;
    if (files.length > 0) {
      const uploadText = document.querySelector('.image-upload p');
      uploadText.textContent = `${files.length} image(s) selected`;
    }
  });

// Star rating interaction
document.querySelectorAll('.rating-stars label').forEach((star) => {
  star.addEventListener('mouseover', function () {
    const siblings = this.parentElement.children;
    const value = this.previousElementSibling.value;

    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i].tagName === 'LABEL') {
        if (i < siblings.length - value) {
          siblings[i].style.color = '#fbbc05';
        } else {
          siblings[i].style.color = '#dadce0';
        }
      }
    }
  });

  star.parentElement.addEventListener('mouseleave', function () {
    const checkedInput = this.querySelector('input:checked');
    const labels = this.querySelectorAll('label');

    labels.forEach((label) => {
      label.style.color = '#dadce0';
    });

    if (checkedInput) {
      const value = checkedInput.value;
      for (let i = labels.length - 1; i >= labels.length - value; i--) {
        labels[i].style.color = '#fbbc05';
      }
    }
  });
});
