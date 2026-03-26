/* eslint-env browser */
/* global fetch, localStorage, document, console, alert */

async function initDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to access dashboard');
        window.location.href = 'login.html';
        return;
    }

    // Set user name
    const userName = localStorage.getItem('userName') || 'User';
    document.getElementById('userName').textContent = `Hi, ${userName}`;
    document.getElementById('dashUserName').textContent = userName;

    // Load saved
    await loadSavedItems();

    // Load stats (mock for now)
    document.getElementById('savedCount').textContent = '3';
    document.getElementById('appliedCount').textContent = '1';
    document.getElementById('viewsCount').textContent = '15';

    // Track view
    trackEvent('dashboard', 'view');
}

async function loadSavedItems() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5000/api/saved', {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        const saved = await response.json();
        displaySavedCards(saved);
    } catch (error) {
        console.error('Error loading saved:', error);
        document.getElementById('savedList').innerHTML = '<p>No saved items or login required</p>';
    }
}

function displaySavedCards(saved) {
    const container = document.getElementById('savedList');
    if (saved.length === 0) {
        container.innerHTML = '<p>No saved opportunities yet. <a href="index.html">Browse now</a></p>';
        return;
    }

    let html = '';
    saved.forEach(item => {
        const opp = item.opportunityId || item.item;
        html += `
      <div class="opp-card">
        <h3>${opp.title}</h3>
        <p class="company">${opp.company || opp.platform}</p>
        <p class="domain">${opp.domain} | ${opp.paid ? 'Paid' : 'Unpaid'}</p>
        <p class="location">${opp.location}</p>
        <div class="card-actions">
          <a href="${opp.url || '#'}" class="apply-btn" target="_blank">Apply</a>
          <button onclick="unsave('${item._id}')" class="unsave-btn">Remove</button>
        </div>
      </div>
    `;
    });
    container.innerHTML = html;
}

async function unsave(id) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`http://localhost:5000/api/save/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        loadSavedItems();
    } catch (error) {
        alert('Error removing');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

async function trackEvent(page, action, domain = '', itemTitle = '') {
    const userId = localStorage.getItem('userId');
    fetch('http://localhost:5000/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, action, domain, itemTitle, userId })
    }).catch(console.error);
}

// Init on load
document.addEventListener('DOMContentLoaded', initDashboard);

function loadDashboard() {
    initDashboard();
}

