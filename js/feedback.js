// Modal functions
function openFeedbackModal() {
  document.getElementById('feedbackModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFeedbackModal() {
  document.getElementById('feedbackModal').classList.remove('active');
  document.body.style.overflow = 'auto';

  // Reset form and show form, hide success message
  document.getElementById('feedbackForm').style.display = 'flex';
  document.getElementById('successMessage').classList.remove('active');
  document.getElementById('feedbackForm').reset();

  // Reset radio button styling
  document.querySelectorAll('.radio-option').forEach((option) => {
    option.classList.remove('selected');
  });
}

function submitAnotherFeedback() {
  document.getElementById('feedbackForm').style.display = 'flex';
  document.getElementById('successMessage').classList.remove('active');
  document.getElementById('feedbackForm').reset();

  // Reset radio button styling
  document.querySelectorAll('.radio-option').forEach((option) => {
    option.classList.remove('selected');
  });
}

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

// Radio button styling
document.querySelectorAll('input[name="userType"]').forEach((radio) => {
  radio.addEventListener('change', function () {
    document.querySelectorAll('.radio-option').forEach((option) => {
      option.classList.remove('selected');
    });
    this.closest('.radio-option').classList.add('selected');
  });
});

// Form submission
document
  .getElementById('feedbackForm')
  .addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const email = formData.get('email');

    // Simulate form submission
    const submitBtn = this.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    setTimeout(() => {
      // Hide form and show success message
      this.style.display = 'none';
      const successMessage = document.getElementById('successMessage');
      const followUpText = document.getElementById('followUpText');

      if (email) {
        followUpText.textContent =
          "We'll follow up with you at " + email + ' if needed.';
      } else {
        followUpText.textContent = 'Feel free to submit more feedback anytime!';
      }

      successMessage.classList.add('active');

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Log feedback data (in real app, this would be sent to server)
      console.log('Feedback submitted:', Object.fromEntries(formData));
    }, 1500);
  });

// Close modal when clicking outside
document
  .getElementById('feedbackModal')
  .addEventListener('click', function (e) {
    if (e.target === this) {
      closeFeedbackModal();
    }
  });

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
  const mobileMenu = document.getElementById('mobileMenu');
  const toggleButton = document.querySelector('.mobile-menu-toggle');

  if (
    !event.target.closest('.navbar') &&
    mobileMenu.classList.contains('active')
  ) {
    mobileMenu.classList.remove('active');
    const icon = toggleButton.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// Add Restaurant button interaction
// document
//   .querySelector('.btn-add-restaurant')
//   .addEventListener('click', function (e) {
//     e.preventDefault();
//     this.style.transform = 'translateY(-2px) scale(1.05)';
//     setTimeout(() => {
//       this.style.transform = 'translateY(-1px)';
//     }, 150);

//     alert(
//       'Add Restaurant feature coming soon! Thank you for your interest in contributing to Food Point Finder.'
//     );
//   });

// Enhanced review hover effects
// document.querySelectorAll('.review').forEach((review) => {
//   review.addEventListener('mouseenter', function () {
//     this.style.transform = 'translateX(8px) scale(1.02)';
//   });

//   review.addEventListener('mouseleave', function () {
//     this.style.transform = 'translateX(0) scale(1)';
//   });
// });

// Smooth scroll behavior for anchor links
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener('click', function (e) {
//     e.preventDefault();
//     const target = document.querySelector(this.getAttribute('href'));
//     if (target) {
//       target.scrollIntoView({
//         behavior: 'smooth',
//       });
//     }
//   });
// });

// // Add scroll-based animations for better UX
// const observerOptions = {
//   threshold: 0.1,
//   rootMargin: '0px 0px -50px 0px',
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       entry.target.style.opacity = '1';
//       entry.target.style.transform = 'translateY(0)';
//     }
//   });
// }, observerOptions);

// Observe all restaurant cards for scroll animations
// document.querySelectorAll('.restaurant-card').forEach((card) => {
//   observer.observe(card);
// });

// Navbar scroll effect
// let lastScrollTop = 0;
// window.addEventListener('scroll', function () {
//   const navbar = document.querySelector('.navbar');
//   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//   if (scrollTop > lastScrollTop && scrollTop > 100) {
//     navbar.style.transform = 'translateY(-100%)';
//   } else {
//     navbar.style.transform = 'translateY(0)';
//   }

//   lastScrollTop = scrollTop;
// });



// Keyboard accessibility for modal
document.addEventListener('keydown', function (e) {
  if (
    e.key === 'Escape' &&
    document.getElementById('feedbackModal').classList.contains('active')
  ) {
    closeFeedbackModal();
  }
});

// Auto-resize textareas
document.querySelectorAll('.form-textarea').forEach((textarea) => {
  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
});

// Form validation feedback
document.querySelectorAll('.form-input, .form-textarea').forEach((input) => {
  input.addEventListener('blur', function () {
    if (this.hasAttribute('required') && !this.value.trim()) {
      this.style.borderColor = '#ea4335';
    } else {
      this.style.borderColor = '#e0e0e0';
    }
  });

  input.addEventListener('input', function () {
    if (this.style.borderColor === 'rgb(234, 67, 53)') {
      this.style.borderColor = '#e0e0e0';
    }
  });
});
