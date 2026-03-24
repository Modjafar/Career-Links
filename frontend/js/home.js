/* eslint-env browser */
/* global window, localStorage, document, alert, console */
// Navigation Functions
function goLogin() {
    window.location.href = "login.html";
}

function goRegister() {
    window.location.href = "register.html";
}

function goAbout() {
    window.location.href = "about.html";
}

function goHome() {
    window.location.href = "index.html";
}

function openDomain(domain) {
    if (domain === "it") {
        window.location.href = "it.html";
    } else if (domain === "finance") {
        window.location.href = "finance.html";
    } else if (domain === "government") {
        window.location.href = "government.html";
    } else if (domain === "management") {
        window.location.href = "management.html";
    } else if (domain === "ecommerce") {
        window.location.href = "ecommerce.html";
    } else if (domain === "english") {
        window.location.href = "english.html";
    }
}

function apply(url) {
    if (localStorage.getItem("token")) {
        window.open(url, '_blank');
    } else {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.href = "login.html";
    }
}

// Theme Toggle Functions
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById("theme-icon");

    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
        if (themeIcon) themeIcon.textContent = "🌙";
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        if (themeIcon) themeIcon.textContent = "☀";
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    const body = document.body;
    const themeIcon = document.getElementById("theme-icon");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        if (themeIcon) themeIcon.textContent = "☀";
    } else {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        if (themeIcon) themeIcon.textContent = "🌙";
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    window.location.href = "index.html";
}

// Update Navbar Profile Section
function updateNavbar() {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    const authButtons = document.getElementById("auth-buttons");
    const profileSection = document.getElementById("profile-section");
    const userDisplayName = document.getElementById("user-display-name");

    if (token && userName) {
        if (authButtons) authButtons.style.display = "none";
        if (profileSection) {
            profileSection.style.display = "flex";
            if (userDisplayName) userDisplayName.textContent = userName;
        }
    } else {
        if (authButtons) authButtons.style.display = "flex";
        if (profileSection) profileSection.style.display = "none";
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
    loadTheme();
    updateNavbar();
});

