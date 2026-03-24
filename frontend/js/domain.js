/* eslint-env browser */
/* global window, localStorage */
function apply(url) {
    if (localStorage.getItem("token")) {
        window.open(url, '_blank');
    } else {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        window.location.href = "login.html";
    }
}
