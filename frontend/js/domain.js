/* eslint-env browser */\n/* global window, localStorage */\n\nfunction apply(url) {
    if (localStorage.getItem("token")) {
        window.open(url, '_blank');
    } else {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.href = "login.html";
    }
}
