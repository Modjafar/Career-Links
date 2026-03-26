/* eslint-env browser */
/* global window, localStorage, document, fetch, alert, console */
console.log("JS Loaded - Enhanced");

'use strict';

(() => {
  const resultsDiv = document.getElementById('searchResults') || document.getElementById('results');
  if (!resultsDiv) return;

  // Search function for new search bar
  window.searchOpportunities = async function () {
    const q = document.getElementById('searchInput').value;
    const domain = document.getElementById('domainSelect').value;
    const type = document.getElementById('typeSelect') ? document.getElementById('typeSelect').value : '';
    const paid = document.getElementById('paidSelect') ? document.getElementById('paidSelect').value : '';

    const params = new URLSearchParams({ q, domain, type, paid });
    const url = `http://localhost:5000/api/search?${params}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      displayResults(data, 'Search Results');
    } catch (error) {
      console.error('Search error:', error);
      resultsDiv.innerHTML = '<p>Error searching. Server may not be running.</p>';
    }
  };

  // Legacy loadData for domain buttons
  window.loadData = async function (type, filter = '') {
    let url = `http://localhost:5000/api/${type}`;
    if (filter) url += `?paid=${filter === 'paid'}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      displayResults(data, type.toUpperCase());
    } catch (error) {
      console.error('Error loading data:', error);
      resultsDiv.innerHTML = '<p>Error loading data. Please try again.</p>';
    }
  };

  function displayResults(data, title) {
    resultsDiv.innerHTML = `<h2>${title} (${data.length})</h2>`;

    if (!data || data.length === 0) {
      resultsDiv.innerHTML += '<p>No opportunities found. Try different filters.</p>';
      return;
    }

    let html = '';
    data.forEach((item, index) => {
      const token = localStorage.getItem('token');
      const isLoggedIn = !!token;
      html += `
        <div class="opp-card modern-card" data-id="${item._id}">
          <h3>${item.title}</h3>
          <p class="company">${item.company || item.platform || 'N/A'}</p>
          <div class="opp-meta">
            <span class="domain-badge">${item.domain}</span>
            <span class="paid-badge">${item.paid ? '💰 Paid' : '🆓 Free'}</span>
            <span class="location">${item.location || 'Remote'}</span>
          </div>
          <div class="card-actions">
            <a href="${item.url || '#'}" class="apply-btn" target="_blank" onclick="trackClick('${item.title}', '${item.domain}')">Apply Now</a>
            ${isLoggedIn ? `<button class="save-btn" onclick="saveOpportunity('${item._id}', ${JSON.stringify(item)})">💾 Save</button>` : ''}
            ${isLoggedIn ? `<a href="dashboard.html" class="dashboard-link">View Dashboard</a>` : ''}
          </div>
        </div>
      `;
    });
    resultsDiv.innerHTML += html;

    // Animations
    document.querySelectorAll('.modern-card').forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  window.saveOpportunity = async function (id, item) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save');
      return;
    }

    try {
      await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ opportunityId: id, item })
      });
      alert('Saved to dashboard!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving. Try again.');
    }
  };

  window.trackClick = function (title, domain) {
    const userId = localStorage.getItem('userId');
    fetch('http://localhost:5000/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'index', action: 'click', domain, itemTitle: title, userId })
    }).catch(console.error);
  };

  // Enter key for search
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchOpportunities();
      });
    }
  });

  // Legacy functions for compatibility
  window.openPaidInternships = function () {
    loadData('internships', 'paid');
  };

  window.openUnpaidInternships = function () {
    loadData('internships', 'unpaid');
  };

  window.openPaidCourses = function () {
    loadData('courses', 'paid');
  };

  window.openUnpaidCourses = function () {
    loadData('courses', 'unpaid');
  };

  window.openJobs = function () {
    loadData('jobs');
  };

  window.checkLoginAndRedirect = function (url) {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', url);
      window.location.href = 'login.html';
    } else {
      window.open(url, '_blank');
    }
  };
})();

