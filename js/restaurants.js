// Restaurants page specific functionality
document.addEventListener('DOMContentLoaded', function () {
  // Initialize restaurant cards
  const restaurantCards = document.querySelectorAll('.restaurant-card');

  restaurantCards.forEach((card, index) => {
    // Add animation delay based on index
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Add scroll-based animations for better UX
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all restaurant cards for scroll animations
  restaurantCards.forEach((card) => {
    observer.observe(card);
  });

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
document
  .querySelector('.btn-add-restaurant')
  .addEventListener('click', function (e) {
    e.preventDefault();
    this.style.transform = 'translateY(-2px) scale(1.05)';
    setTimeout(() => {
      this.style.transform = 'translateY(-1px)';
    }, 150);

    // Simulate action - in real app would navigate to add restaurant form
    alert(
      'Add Restaurant feature coming soon! Thank you for your interest in contributing to Food Point Finder.'
    );
  });

// Enhanced review hover effects
document.querySelectorAll('.review').forEach((review) => {
  review.addEventListener('mouseenter', function () {
    this.style.transform = 'translateX(8px) scale(1.02)';
  });

  review.addEventListener('mouseleave', function () {
    this.style.transform = 'translateX(0) scale(1)';
  });
});

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
      });
    }
  });
});

// Add scroll-based animations for better UX
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all restaurant cards for scroll animations
document.querySelectorAll('.restaurant-card').forEach((card) => {
  observer.observe(card);
});

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollTop = scrollTop;
});
