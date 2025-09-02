// Login form submission handler
function handleLogin(event) {
  event.preventDefault();

  // Here you would typically send the form data to your backend
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  // Add your login logic here
  console.log('Login data:', data);
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

// Form submission handler
function handleLogin(event) {
  event.preventDefault();

  // Here you would typically send the form data to your backend
  alert('Login successful! (Demo only)');
  // Optionally redirect to home page
  // window.location.href = '../index.html';
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
