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
                // Store login status
                localStorage.setItem("isLoggedIn", "true");

                // Store user data
                localStorage.setItem("userName", data.user.name);
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userId", data.user._id);

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
