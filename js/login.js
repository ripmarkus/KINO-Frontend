function togglePassword() {
    const password = document.getElementById("password");
    const toggle = document.querySelector(".toggle-password");
    if (password.type === "password") {
        password.type = "text";
        toggle.textContent = "Skjul"; // ikon skifter
    } else {
        password.type = "password";
        toggle.textContent = "Vis"; // ikon skifter tilbage
    }
}

