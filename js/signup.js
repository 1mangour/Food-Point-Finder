// Signup form submission handler
function handleSignup(event) {
  event.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Here you would typically send the form data to your backend
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  // Add your signup logic here
  console.log('Signup data:', data);
}

// Password validation
document.getElementById('password')?.addEventListener('input', function () {
  // Add your password validation logic here
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
function handleSignup(event) {
  event.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Here you would typically send the form data to your backend
  alert('Account created successfully! (Demo only)');
  // Optionally redirect to login page
  // window.location.href = 'login.html';
}

// Password validation
document.getElementById('password').addEventListener('input', function () {
  const password = this.value;
  // Add your password validation logic here
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
    icon.classList.add( 'fa-bars');
  }
});
