const resultsDiv = document.getElementById("results");

// Internships
document.querySelector(".card:nth-child(1) .btn-paid")
  .addEventListener("click", () => loadData("internships", "paid"));

document.querySelector(".card:nth-child(1) .btn-unpaid")
  .addEventListener("click", () => loadData("internships", "unpaid"));

// Courses
document.querySelector(".card:nth-child(2) .btn-paid")
  .addEventListener("click", () => loadData("courses", "paid"));

document.querySelector(".card:nth-child(2) .btn-unpaid")
  .addEventListener("click", () => loadData("courses", "unpaid"));

// Jobs
document.querySelector(".card:nth-child(3) .btn-paid")
  .addEventListener("click", () => loadData("jobs"));

function loadData(type, filter = "") {
  let url = `http://localhost:5000/api/${type}`;
  if (filter) url += `?type=${filter}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      resultsDiv.innerHTML = `<h2>${type.toUpperCase()}</h2>`;

      if (data.length === 0) {
        resultsDiv.innerHTML += "<p>No data found</p>";
        return;
      }

      data.forEach(item => {
        resultsDiv.innerHTML += `
          <div style="margin:10px; padding:10px; border:1px solid #ddd;">
            <strong>${item.title}</strong><br/>
            <span>${item.company || item.platform}</span>
          </div>
        `;
      });
    });
}

function openPaidInternships() {
  window.open("https://internshala.com/internships/paid-internship", "_blank");
}

function openUnpaidInternships() {
  window.open("https://internshala.com/internships/unpaid-internship", "_blank");
}

function openPaidCourses() {
  window.open("https://www.coursera.org", "_blank");
}

function openUnpaidCourses() {
  window.open("https://www.edx.org", "_blank");
}

function openJobs() {
  window.open("https://www.linkedin.com/jobs", "_blank");
}

function checkLoginAndRedirect(url) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    // Save where user wanted to go
    localStorage.setItem("redirectAfterLogin", url);
    window.location.href = "login.html";
  } else {
    window.open(url, "_blank");
  }
}


