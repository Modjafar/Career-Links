/* eslint-env browser */
/* global window, localStorage, document, fetch, alert, console */

'use strict';

(() => {
  const resultsDiv = document.getElementById('results');

  if (!resultsDiv) return;

  // Event Listeners - Internships
  const paidInternBtn = document.querySelector('.card:nth-child(1) .btn-paid');
  const unpaidInternBtn = document.querySelector('.card:nth-child(1) .btn-unpaid');
  if (paidInternBtn) paidInternBtn.addEventListener('click', () => loadData('internships', 'paid'));
  if (unpaidInternBtn) unpaidInternBtn.addEventListener('click', () => loadData('internships', 'unpaid'));

  // Event Listeners - Courses
  const paidCourseBtn = document.querySelector('.card:nth-child(2) .btn-paid');
  const unpaidCourseBtn = document.querySelector('.card:nth-child(2) .btn-unpaid');
  if (paidCourseBtn) paidCourseBtn.addEventListener('click', () => loadData('courses', 'paid'));
  if (unpaidCourseBtn) unpaidCourseBtn.addEventListener('click', () => loadData('courses', 'unpaid'));

  // Event Listeners - Jobs
  const jobsBtn = document.querySelector('.card:nth-child(3) .btn-paid');
  if (jobsBtn) jobsBtn.addEventListener('click', () => loadData('jobs'));

  function loadData(type, filter = '') {
    const baseUrl = 'http://localhost:5000/api/' + type;
    const url = filter ? baseUrl + '?type=' + filter : baseUrl;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        resultsDiv.innerHTML = '<h2>' + type.toUpperCase() + '</h2>';

        if (!data || data.length === 0) {
          resultsDiv.innerHTML += '<p>No data found</p>';
          return;
        }

        let html = '';
        data.forEach((item) => {
          html += `
            <div style="margin: 10px; padding: 10px; border: 1px solid #ddd;">
              <strong>${item.title}</strong><br>
              <span>${item.company || item.platform}</span>
            </div>
          `;
        });
        resultsDiv.innerHTML += html;
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        resultsDiv.innerHTML = '<p>Error loading data. Please try again.</p>';
      });
  }

  window.openPaidInternships = function () {
    window.open('https://internshala.com/internships/paid-internship', '_blank');
  };

  window.openUnpaidInternships = function () {
    window.open('https://internshala.com/internships/unpaid-internship', '_blank');
  };

  window.openPaidCourses = function () {
    window.open('https://www.coursera.org', '_blank');
  };

  window.openUnpaidCourses = function () {
    window.open('https://www.edx.org', '_blank');
  };

  window.openJobs = function () {
    window.open('https://www.linkedin.com/jobs', '_blank');
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

