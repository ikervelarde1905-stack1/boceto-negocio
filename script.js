const cart = new Map();

const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total strong");
const checkoutButton = document.querySelector(".checkout-button");
const toast = document.querySelector(".toast");

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderCart() {
  let quantity = 0;
  let total = 0;

  cartItems.innerHTML = "";

  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu pedido esta vacio.</p>';
  }

  cart.forEach((item, name) => {
    quantity += item.quantity;
    total += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div><strong>${name}</strong><span>${formatPrice(item.price)}</span></div>
      <div class="quantity">
        <button type="button" data-action="decrease" data-name="${name}" aria-label="Quitar uno">−</button>
        <strong>${item.quantity}</strong>
        <button type="button" data-action="increase" data-name="${name}" aria-label="Agregar uno">+</button>
      </div>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    `;
    cartItems.appendChild(row);
  });

  cartCount.textContent = quantity;
  cartTotal.textContent = formatPrice(total);
  checkoutButton.disabled = cart.size === 0;
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.get(name);
    cart.set(name, existing ? { ...existing, quantity: existing.quantity + 1 } : { price, quantity: 1 });
    renderCart();
    showToast(`${name} agregado`);
  });
});

document.querySelectorAll("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
document.querySelectorAll("[data-close-cart]").forEach((button) => button.addEventListener("click", closeCart));

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const item = cart.get(button.dataset.name);
  if (!item) return;

  if (button.dataset.action === "increase") item.quantity += 1;
  if (button.dataset.action === "decrease") item.quantity -= 1;
  if (item.quantity <= 0) cart.delete(button.dataset.name);
  else cart.set(button.dataset.name, item);
  renderCart();
});

checkoutButton.addEventListener("click", () => {
  let message = "Hola, quiero hacer el siguiente pedido:%0A";
  cart.forEach((item, name) => {
    message += `${item.quantity} x ${name} - ${formatPrice(item.price * item.quantity)}%0A`;
  });
  message += `%0ATotal: ${cartTotal.textContent}`;
  window.open(`https://wa.me/12025550148?text=${message}`, "_blank", "noopener");
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    const category = button.dataset.category;
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("hidden", category !== "todos" && card.dataset.category !== category);
    });
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderCart();
