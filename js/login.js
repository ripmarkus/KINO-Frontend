document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const toggleBtn = document.querySelector(".toggle-password");
    const errorBox = document.getElementById("formError");
    const submitBtn = form.querySelector(".auth-submit");

    const API_BASE = `${window.location.origin}/api`;

    // Vis/skjul adgangskode
    toggleBtn.addEventListener("click", () => {
        const isHidden = password.type === "password";
        password.type = isHidden ? "text" : "password";
        toggleBtn.textContent = isHidden ? "Hide" : "Show";
        toggleBtn.setAttribute("aria-pressed", String(isHidden));
        toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        password.focus({
            preventScroll: true} // Bevar fokus uden at scrolle
        );
    });

    // Funktion til at sætte fejlbesked
    function setError(message) {
        errorBox.textContent = message || "";
        errorBox.hidden = !message;
    }

    // Nulstil fejlbesked ved ny indsendelse
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        setError(""); // Nulstil fejlbesked

        if (!username.value || !password.value) {
            setError("Please fill in both username and password.");
            return;
        }

        submitBtn.disabled = true; // Deaktiver knappen for at forhindre flere klik

        try {

            const res = await fetch(`${API_BASE}/auth/login`, { // Opdateret endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json"},
                // Send data som JSON
                body: JSON.stringify({
                    username: username.value.trim(),
                    password: password.value.trim()
                })
            });

            const data = await res.json().catch(() => ({})); // Håndter JSON parse fejl

            if (!data.success) {
                setError(data.message || "Invalid credentials. Please try again."); // Generisk fejlbesked
                return;
            }

            const role = (data.role || "").toUpperCase(); // Forventet at API returnerer brugerrolle

            localStorage.setItem("roles", JSON.stringify([role])); // Gem rolle i localStorage
            localStorage.setItem("username", username.value.trim()); // Gem brugernavn

            // Rolle-baseret redirect (fallback til employee)
            if (role === "MANAGER") {
                window.location.href = "./employee-dashboard.html";
            } else if (role === "OPERATOR") {
                window.location.href = "./operator.html";
            } else {
                window.location.href = "./employee.html";
            }
        } catch (err) {
            setError("Network error. Please try again."); // Netværksfejl
        } finally {
            submitBtn.disabled = false; // Genaktiver knappen
        }
    });
});
