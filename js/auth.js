// Opbevar og håndter brugerens autentificeringstilstand og roller ved hjælp af localStorage
function getRoles() {
    try {
        return JSON.parse(localStorage.getItem("roles") || "[]");
    } catch {
        return [];
    }
}

// Tjek om brugeren har en bestemt rolle
function hasAnyRole(...required) {
    const roles = getRoles();
    return required.some(r => roles.includes(r));
}

// Redirect til login hvis brugeren ikke har en af de krævede roller
function requireAnyRole(...required) {
    if (!hasAnyRole(...required)) {
        window.location.replace("./index.html?forbidden=1");
    }
}

// Redirect brugeren til deres "hjem" side baseret på deres rolle
function goHomeByRole() {
    const roles = getRoles();
    if (roles.includes("MANAGER")) {
        window.location.href = "./employee-dashboard.html";
    } else if (roles.includes("OPERATOR")) {
        window.location.href = "./operator.html";
    } else if (roles.includes("SALES_CLERK")) {
        window.location.href= "./employee.html";
    } else {
        window.location.href = "./login.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("logoutBtn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("roles");
        localStorage.removeItem("username");
        localStorage.removeItem("jwt");
        window.location.href = "./index.html";
    });
});