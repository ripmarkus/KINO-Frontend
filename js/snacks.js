// Require SALES_CLERK or MANAGER role
requireAnyRole("SALES_CLERK", "MANAGER");

const API_BASE = "http://localhost:8080/api";
const cartState = {};

// ========= Initialize ==========
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("checkoutBtn").addEventListener("click", checkout);
    document.getElementById("clearBtn").addEventListener("click", clearCart);
    loadSnacks();
});

// ========= Load Snacks from API ==========
async function loadSnacks() {
    try {
        const response = await fetch(`${API_BASE}/snack-items`);
        if (!response.ok) throw new Error("Failed to load snacks");

        const snacks = await response.json();
        const container = document.getElementById("snackItems");

        if (snacks.length === 0) {
            container.innerHTML = "<p class='empty-cart'>No snacks available</p>";
            return;
        }

        container.innerHTML = snacks.map(snack => `
            <div class="snack-item" onclick="addToCart(${snack.itemId}, '${snack.name}', ${snack.price}, ${snack.stock})">
                <div class="snack-item-name">${snack.name}</div>
                <div class="snack-item-price">${snack.price.toFixed(2)} DKK</div>
                <div class="snack-item-stock ${snack.stock === 0 ? 'out' : snack.stock < 5 ? 'low' : ''}">
                    Stock: ${snack.stock}
                </div>
            </div>
        `).join("");
    } catch (error) {
        showAlert("Error loading snacks: " + error.message, "error");
        document.getElementById("snackItems").innerHTML = "<p class='empty-cart'>Error loading snacks</p>";
    }
}

// ========= Cart Management ==========
function addToCart(id, name, price, stock) {
    if (stock === 0) {
        showAlert(`${name} is out of stock`, "error");
        return;
    }

    if (!cartState[id]) {
        cartState[id] = { name, price, stock, quantity: 0 };
    }

    if (cartState[id].quantity < stock) {
        cartState[id].quantity++;
        updateCartUI();
    } else {
        showAlert(`Cannot add more ${name}. Maximum stock: ${stock}`, "error");
    }
}

function updateQuantity(id, change) {
    if (cartState[id]) {
        const newQty = cartState[id].quantity + change;
        if (newQty <= 0) {
            delete cartState[id];
        } else if (newQty <= cartState[id].stock) {
            cartState[id].quantity = newQty;
        } else {
            showAlert(`Cannot exceed available stock (${cartState[id].stock})`, "error");
            return;
        }
        updateCartUI();
    }
}

function removeFromCart(id) {
    delete cartState[id];
    updateCartUI();
}

function clearCart() {
    Object.keys(cartState).forEach(key => delete cartState[key]);
    updateCartUI();
}

// ========= UI Updates ==========
function updateCartUI() {
    const cartContainer = document.getElementById("cart");
    const items = Object.entries(cartState);

    if (items.length === 0) {
        cartContainer.innerHTML = "<div class='empty-cart'>Cart is empty</div>";
        document.getElementById("checkoutBtn").disabled = true;
        document.getElementById("subtotal").textContent = "0.00 DKK";
        document.getElementById("total").textContent = "0.00 DKK";
        return;
    }

    let subtotal = 0;
    cartContainer.innerHTML = items.map(([id, item]) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-detail">${item.price.toFixed(2)} DKK each</div>
                </div>
                <div class="cart-item-price">${itemTotal.toFixed(2)} DKK</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${id}, -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${id}, 1)">+</button>
                    <button class="btn-remove" onclick="removeFromCart(${id})">Remove</button>
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " DKK";
    document.getElementById("total").textContent = subtotal.toFixed(2) + " DKK";
    document.getElementById("checkoutBtn").disabled = false;
}

// ========= Checkout ==========
async function checkout() {
    const items = Object.entries(cartState);
    if (items.length === 0) {
        showAlert("Cart is empty", "error");
        return;
    }

    // Build items object: { "itemId": quantity } (string keys!)
    const itemsForSale = {};
    items.forEach(([id, item]) => {
        itemsForSale[id] = item.quantity;  // Keep id as string, not parseInt
    });

    const saleData = {
        items: itemsForSale
    };

    console.log("Sending sale data:", saleData);

    try {
        document.getElementById("checkoutBtn").disabled = true;
        const response = await fetch(`${API_BASE}/snack-sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to complete sale");
        }

        const result = await response.json();
        const total = result.totalPrice;
        showAlert(`Sale completed! Total: ${total.toFixed(2)} DKK`, "success");

        Object.keys(cartState).forEach(key => delete cartState[key]);
        updateCartUI();
        loadSnacks();
    } catch (error) {
        showAlert("Error: " + error.message, "error");
        document.getElementById("checkoutBtn").disabled = false;
    }
}

// ========= Alerts ==========
function showAlert(message, type) {
    const alert = document.getElementById("alert");
    alert.textContent = message;
    alert.className = `alert show alert-${type}`;
    setTimeout(() => alert.classList.remove("show"), 4000);
}