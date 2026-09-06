"use strict";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const ADMIN_LOGIN_KEY = "jasa_kampung_admin_login";

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const showPassword = document.getElementById("showPassword");
    const errorBox = document.getElementById("loginError");

    // Jika sudah login, langsung ke dashboard
    if (localStorage.getItem(ADMIN_LOGIN_KEY) === "true") {
        window.location.href = "admin.html";
        return;
    }

    // Tampilkan / sembunyikan password
    showPassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            showPassword.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            showPassword.textContent = "👁️";
        }

    });

    // Login
    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            passwordInput.value;

        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem(
                ADMIN_LOGIN_KEY,
                "true"
            );

            window.location.href = "admin.html";

        } else {

            errorBox.style.display = "block";

            passwordInput.value = "";
            passwordInput.focus();

        }

    });

});