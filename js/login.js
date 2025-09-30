const { AuthHelpers, UIHelpers } = window.supabaseConfig;

const showError = (message) => {
    UIHelpers.showError(message);
};

const showSuccess = (message) => {
    UIHelpers.showSuccess(message);
};

// Single login function with full Supabase integration
async function handleLogin(event) {
    event.preventDefault();
    
    // Clear previous messages
    showError('');
    showSuccess('');
    
    // Get form data
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Form validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    try {
        // Actual Supabase authentication
        const { data, error } = await AuthHelpers.signIn(email, password);
        
        if (error) {
            showError(error.message);
        } else {
            showSuccess('Login successful! Redirecting...');
            
            // Store user session info
            localStorage.setItem('user_email', data.user.email);
            
            // Redirect after successful login
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An unexpected error occurred. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Google login with Supabase OAuth
async function handleGoogleLogin() {
    try {
        const { error } = await window.supabaseConfig.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });
        
        if (error) {
            showError('Google login failed: ' + error.message);
        }
    } catch (error) {
        console.error('Google login error:', error);
        showError('Google login failed. Please try again.');
    }
}

// Facebook login with Supabase OAuth
async function handleFacebookLogin() {
    try {
        const { error } = await window.supabaseConfig.supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });
        
        if (error) {
            showError('Facebook login failed: ' + error.message);
        }
    } catch (error) {
        console.error('Facebook login error:', error);
        showError('Facebook login failed. Please try again.');
    }
}

window.handleLogin = handleLogin;
window.handleGoogleLogin = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;