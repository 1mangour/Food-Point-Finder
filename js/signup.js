const { AuthHelpers, UIHelpers } = window.supabaseConfig;

const showError = (message) => {
    UIHelpers.showError(message);
};

const showSuccess = (message) => {
    UIHelpers.showSuccess(message);
};

// Single signup function with full Supabase integration
async function handleSignup(event) {
    event.preventDefault();
    
    // Clear previous messages
    showError('');
    showSuccess('');
    
    // Get form data
    const formData = new FormData(event.target);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Comprehensive form validation
    if (!fullName || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
        // Actual Supabase user creation
        const { data, error } = await AuthHelpers.signUp(email, password, { data: { full_name: fullName, display_name: fullName } });
        
        if (error) {
            showError(error.message);
        } else {
            showSuccess('Account created successfully! Please check your email for verification.');
            
            // Clear form after successful signup
            event.target.reset();
            
            // Redirect to login after successful signup
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError('An unexpected error occurred. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Real-time password validation
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordFeedback = document.getElementById('password-feedback');

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            checkPasswordStrength(password);
        });
    }

    function checkPasswordStrength(password) {
        const strength = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        let score = 0;
        for (const key in strength) {
            if (strength[key]) {
                score++;
            }
        }

        const feedbackDivs = passwordFeedback.children;
        for (let i = 0; i < feedbackDivs.length; i++) {
            feedbackDivs[i].className = '';
        }

        if (score <= 2) {
            for (let i = 0; i < score; i++) {
                feedbackDivs[i].classList.add('weak');
            }
        } else if (score <= 4) {
            for (let i = 0; i < score; i++) {
                feedbackDivs[i].classList.add('medium');
            }
        } else {
            for (let i = 0; i < feedbackDivs.length; i++) {
                feedbackDivs[i].classList.add('strong');
            }
        }
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput ? passwordInput.value : '';
            const confirmPassword = this.value;
            const feedback = document.getElementById('confirm-password-feedback');
            
            if (confirmPassword.length === 0) {
                if (feedback) feedback.style.display = 'none';
                return;
            }
            
            if (feedback) {
                if (password !== confirmPassword) {
                    feedback.textContent = 'Passwords do not match';
                    feedback.style.color = '#ef4444';
                    feedback.style.display = 'block';
                } else {
                    feedback.textContent = 'Passwords match';
                    feedback.style.color = '#10b981';
                    feedback.style.display = 'block';
                }
            }
        });
    }
});

// Google signup with Supabase OAuth
async function handleGoogleSignup() {
    try {
        const { error } = await window.supabaseConfig.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });
        
        if (error) {
            showError('Google signup failed: ' + error.message);
        }
    } catch (error) {
        console.error('Google signup error:', error);
        showError('Google signup failed. Please try again.');
    }
}

// Facebook signup with Supabase OAuth
async function handleFacebookSignup() {
    try {
        const { error } = await window.supabaseConfig.supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });
        
        if (error) {
            showError('Facebook signup failed: ' + error.message);
        }
    } catch (error) {
        console.error('Facebook signup error:', error);
        showError('Facebook signup failed. Please try again.');
    }
}

window.handleSignup = handleSignup;
window.handleGoogleSignup = handleGoogleSignup;
window.handleFacebookSignup = handleFacebookSignup;