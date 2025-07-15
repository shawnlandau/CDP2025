// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    const userEmailSpan = document.getElementById('userEmail');

    // Check if user is already signed in
    firebaseAuth.onAuthStateChanged(function(user) {
        if (user) {
            // User is already signed in, redirect to upload page
            window.location.href = 'upload.html';
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';

        // Send magic link with root domain
        const actionCodeSettings = {
            url: 'https://shawnlandau.github.io/CDP2025/',
            handleCodeInApp: true
        };

        console.log('Sending magic link to:', actionCodeSettings.url);

        firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings)
            .then(() => {
                // Save email to localStorage for later use
                window.localStorage.setItem('emailForSignIn', email);
                
                // Show success message
                userEmailSpan.textContent = email;
                loginForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                console.log('Magic link sent successfully');
            })
            .catch((error) => {
                console.error('Error sending magic link:', error);
                
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'flex';
                btnLoading.style.display = 'none';
                
                // Show error message
                let errorMessage = 'An error occurred. Please try again.';
                
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email address.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many requests. Please try again later.';
                        break;
                }
                
                alert(errorMessage);
            });
    });

    // Handle magic link sign-in
    if (firebaseAuth.isSignInWithEmailLink(window.location.href)) {
        console.log('Magic link detected, processing sign-in...');
        
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
            // If email is not found in localStorage, prompt user
            email = window.prompt('Please provide your email for confirmation');
        }

        firebaseAuth.signInWithEmailLink(email, window.location.href)
            .then((result) => {
                console.log('Sign-in successful:', result);
                
                // Clear email from localStorage
                window.localStorage.removeItem('emailForSignIn');
                
                // Redirect to upload page
                window.location.href = 'upload.html';
            })
            .catch((error) => {
                console.error('Error signing in with email link:', error);
                alert('There was an error signing you in. Please try again.');
            });
    } else {
        console.log('No magic link detected on this page');
    }
}); 