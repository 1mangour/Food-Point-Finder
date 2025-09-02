// Mobile menu toggle functionality shared across all pages
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
    const toggleIcon = toggleButton.querySelector('i');
    toggleIcon.classList.remove('fa-times');
    toggleIcon.classList.add('fa-bars');
  }
});
