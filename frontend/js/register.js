/* eslint-env browser */
/* global window, document, fetch, alert, console */
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    console.log("Attempting registration with email:", email);

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        console.log("Register response status:", response.status);

        const data = await response.json();
        console.log("Register response data:", data);

        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please try again.');
    }
});

// Navigation functions
function goLogin() {
    window.location.href = 'login.html';
}

function goRegister() {
    window.location.href = 'register.html';
}

function goAbout() {
    alert('Career Links helps students find internships, courses and jobs.');
}
