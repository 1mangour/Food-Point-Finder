async function submitFeedback(feedbackData) {
  try {
    const supabase = window.supabaseConfig.supabase;
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackData]);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending feedback:', error);
    return { success: false, error: error.message };
  }
}

// Modal management utilities
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
}

function submitAnotherFeedback() {
  document.getElementById('feedbackForm').style.display = 'flex';
  document.getElementById('successMessage').classList.remove('active');
  document.getElementById('feedbackForm').reset();
}

// Event listener for feedback button
document.addEventListener('DOMContentLoaded', function () {
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackCloseBtn = document.getElementById('feedbackCloseBtn');
  const continueExploringBtn = document.getElementById('continueExploringBtn');
  const submitAnotherBtn = document.getElementById('submitAnotherBtn');

  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', openFeedbackModal);
  }
  if (feedbackCloseBtn) {
    feedbackCloseBtn.addEventListener('click', closeFeedbackModal);
  }
  if (continueExploringBtn) {
    continueExploringBtn.addEventListener('click', closeFeedbackModal);
  }
  if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener('click', submitAnotherFeedback);
  }
});

// Form submission
document
  .getElementById('feedbackForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    // Prepare data according to your database schema
    const feedbackData = {
      improvements: formData.get('improvements'),
      email: formData.get('email') || null,
    };

    // Validate required fields
    if (!feedbackData.improvements || feedbackData.improvements.trim() === '') {
      alert('Please provide your feedback in the improvements field.');
      return;
    }

    // Validate email if provided
    if (feedbackData.email && feedbackData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(feedbackData.email)) {
        alert('Please enter a valid email address or leave it empty.');
        return;
      }
    }

    const submitBtn = this.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
      // Submit to Supabase
      const result = await submitFeedback(feedbackData);

      if (result.success) {
        // Hide form and show success message
        this.style.display = 'none';
        const successMessage = document.getElementById('successMessage');
        const followUpText = document.getElementById('followUpText');

        if (feedbackData.email) {
          followUpText.textContent = `We'll follow up with you at ${feedbackData.email} if needed.`;
        } else {
          followUpText.textContent =
            'Feel free to submit more feedback anytime!';
        }

        successMessage.classList.add('active');

        console.log('Feedback submitted successfully:', feedbackData);
      } else {
        alert(
          'Error submitting feedback: ' + (result.error || 'Unknown error'),
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting feedback. Please try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function () {
  const feedbackModal = document.getElementById('feedbackModal');
  if (feedbackModal) {
    feedbackModal.addEventListener('click', function (e) {
      if (e.target === this) {
        closeFeedbackModal();
      }
    });
  }
});

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

//  <script type="module">
//       import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

//       // Your Supabase credentials (Note: the key in your code was incomplete)
//       const supabaseUrl = 'https://mzvwxsdykc.supabase.co';
//       const supabaseKey = 'YOUR_ACTUAL_SUPABASE_ANON_KEY'; // Replace with your actual key

//       // Create Supabase client and make it globally available
//       window.supabaseClient = createClient(supabaseUrl, supabaseKey);

//       // Feedback submission function
