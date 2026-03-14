function apply(url) {
    if (localStorage.getItem("isLoggedIn") === "true") {
        window.open(url, '_blank');
    } else {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.href = "login.html";
    }
}
