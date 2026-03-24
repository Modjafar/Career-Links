/* eslint-env browser */
/* global window, document, fetch, alert, console */

document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

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

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error(error);
        alert('Network error');
    }
});

// Navigation
function goLogin() {
    window.location.href = 'login.html';
}
