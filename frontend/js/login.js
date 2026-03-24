/* eslint-env browser */
/* global window, localStorage, document, fetch, alert, console */
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    console.log("Attempting login with email:", email);

    fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(res => {
            console.log("Login response status:", res.status);
            return res.json();
        })
        .then(data => {
            console.log("Login response data:", data);
            if (data.success) {
                // Store JWT token
                localStorage.setItem("token", data.token);

                // Store user data
                localStorage.setItem("userName", data.user.name);
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userId", data.user.id);

                // Test protected route
                fetch("http://localhost:5000/api/profile", {
                    headers: {
                        "Authorization": data.token
                    }
                }).then(res => res.json()).then(profileData => {
                    console.log("Profile fetch success:", profileData);
                }).catch(err => console.error("Profile fetch failed:", err));

                // Get redirect URL before clearing
                const redirect = localStorage.getItem("redirectAfterLogin");

                // Clear redirect stored
                localStorage.removeItem("redirectAfterLogin");

                // Redirect to the stored URL or index.html
                if (redirect) {
                    window.location.href = redirect;
                } else {
                    alert("Login successful! Welcome, " + data.user.name);
                    window.location.href = "index.html";
                }
            } else {
                alert(data.message || "Invalid login credentials");
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        });
}
