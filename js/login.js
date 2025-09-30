document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const password = document.getElementById("password");
    const toggleBtn = document.querySelector(".toggle-password");
    // Vis/skjul adgangskode
    toggleBtn.addEventListener("click", () => {
        const isHidden = password.type === "password";
        password.type = isHidden ? "text" : "password";
        toggleBtn.textContent = isHidden ? "Skjul" : "Vis";
        toggleBtn.setAttribute("aria-pressed", String(isHidden));
        password.focus({preventScroll: true});
    });

    // Fake login funktionalitet --> redirect til employee-dashboard.html
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "./employee-dashboard.html";
    });
});