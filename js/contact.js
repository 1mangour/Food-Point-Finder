// Contact form submission - Save to Supabase
async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  // Validate form data
  if (!data.name || !data.email || !data.subject || !data.message) {
    alert('Please fill in all fields');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    alert('Please enter a valid email address');
    return;
  }

  try {
    const supabase = window.supabaseConfig.supabase;
    const { error } = await supabase.from('contacts').insert([data]);

    if (error) {
      console.error('Error submitting contact form:', error);
      alert('Error submitting message. Please try again.');
      return;
    }

    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
  } catch (error) {
    console.error('Error:', error);
    alert('Error submitting message. Please try again.');
  }
}

// FAQ toggle functionality
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
