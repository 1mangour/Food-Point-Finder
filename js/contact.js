// Contact form submission
function handleSubmit(event) {
  event.preventDefault();

  // Here you would typically send the contact form data to your backend
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  // Add your contact form submission logic here
  console.log('Contact form data:', data);
}

// FAQ toggle functionality
function toggleFAQ(element) {
  element.classList.toggle('active');

  // Add your FAQ toggle animation logic here
  const answer = element.querySelector('.faq-answer');
  if (element.classList.contains('active')) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
  } else {
    answer.style.maxHeight = 0;
  }
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

// Contact form submission
function handleSubmit(event) {
  event.preventDefault();

  // Here you would typically send the form data to your backend
  alert('Thank you for your message! We will get back to you soon.');
  event.target.reset();
}

// FAQ toggle
function toggleFAQ(element) {
  const faqItem = element.parentElement;
  const isActive = faqItem.classList.contains('active');

  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.classList.remove('active');
  });

  // Open clicked item if it wasn't already open
  if (!isActive) {
    faqItem.classList.add('active');
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
