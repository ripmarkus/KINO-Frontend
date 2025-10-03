document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const remember = document.getElementById("remember");
    const toggleBtn = document.querySelector(".toggle-password");
    const errorBox = document.getElementById("formError");
    const submitBtn = form.querySelector(".auth-submit");

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

//     // Funktion til at sætte fejlbesked
//     function setError(message) {
//         errorBox.textContent = message || "";
//         errorBox.hidden = !message;
//     }
//
//     // Nulstil fejlbesked ved ny indsendelse
//     form.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         setError(""); // Nulstil fejlbesked
//
//         if (!email.value || !password.value) {
//             setError("Please fill in both email and password.");
//             return;
//         }
//
//         submitBtn.disabled = true; // Deaktiver knappen for at forhindre flere klik
//
//         try {
//             const csrf = document.querySelector('meta[name="csrf-token"]')?.content; // Hent CSRF-token fra meta-tag
//
//             const res = await fetch("api/auth/login", { // Opdateret endpoint
//                 method: "POST",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(csrf ? {"X-CSRF-Token": csrf} : {})
//                 },
//                 // Send data som JSON
//                 body: JSON.stringify({
//                     email: email.value.trim(),
//                     password: password.value,
//                     remember: !!remember.checked
//                 })
//             });
//
//             if (!res.ok) {
//                 setError("Invalid credentials. Please try again."); // Generisk fejlbesked
//                 return;
//             }
//
//             const data = await res.json().catch(() => ({})); // Håndter JSON parse fejl
//             const role = data.role?.toUpperCase(); // Forventet at API returnerer brugerrolle
//
//             // Rolle-baseret redirect (fallback til employee)
//             if (role === "MANAGER") {
//                 window.location.href = "./manager-dashboard.html";
//             } else if (role === "ADMIN") {
//                 window.location.href = "./admin-dashboard.html";
//             } else {
//                 window.location.href = "./employee-dashboard.html";
//             }
//         } catch (err) {
//             setError("Network error. Please try again."); // Netværksfejl
//         } finally {
//             submitBtn.disabled = false; // Genaktiver knappen
//         }
//     });
// });

    // Fake login funktionalitet --> redirect til employee-dashboard.html
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "./employee-dashboard.html";
    }
    );
});