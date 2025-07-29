/*
 * scripts för startsidan och gemensamma funktioner.
 */

// Funktionen för att visa sökförslag baserat på produktnamn
const searchInput = document.getElementById('searchInput');
const suggestionsList = document.getElementById('searchSuggestions');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    // Rensa tidigare förslag
    suggestionsList.innerHTML = '';
    if (query.length === 0) {
      return;
    }
    // Filtrera produkter som matchar query i namnet
    const matches = window.PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(query)
    ).slice(0, 5);
    matches.forEach((product) => {
      const li = document.createElement('li');
      li.textContent = product.name;
      li.addEventListener('click', () => {
        // Navigera till produktsidan med id i querystring
        window.location.href = `product.html?id=${product.id}`;
      });
      suggestionsList.appendChild(li);
    });
  });
  // Dölj förslag när man klickar utanför
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
      suggestionsList.innerHTML = '';
    }
  });
}

// Newsletter-formulär
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const messageEl = document.getElementById('newsletterMessage');
    const email = emailInput.value.trim();
    // Enkelt e-postvalidering
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (emailRegex.test(email)) {
      // Spara e-post i localStorage (pseudo-handling)
      let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
      }
      messageEl.textContent = 'Tack för din anmälan!';
      messageEl.style.color = 'lime';
      emailInput.value = '';
    } else {
      messageEl.textContent = 'Ange en giltig e-postadress.';
      messageEl.style.color = 'red';
    }
  });
}

// Hjälpfunktion: hämta produkt efter id
function getProductById(id) {
  return window.PRODUCTS.find((p) => p.id === Number(id));
}

// Spara och hämta favoriter i localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}
function toggleFavorite(productId) {
  const favs = getFavorites();
  const idx = favs.indexOf(productId);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(productId);
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
  // Uppdatera favorit-räkning i header
  updateCounts();
}

// Spara och hämta varukorg i localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function addToCart(productId, size, quantity) {
  const cart = getCart();
  const existing = cart.find(
    (item) => item.id === productId && item.size === size
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, size, quantity });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  // Uppdatera varukorgsräkning i header
  updateCounts();
}

// Uppdatera räknare för favoriter och varukorg i headern
function updateCounts() {
  const favs = getFavorites();
  const wishlistCountEl = document.getElementById('wishlistCount');
  if (wishlistCountEl) {
    wishlistCountEl.textContent = favs.length;
  }
  const cartItems = getCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
  }
}

// Kör uppdatering av räknare när sidan laddat
document.addEventListener('DOMContentLoaded', updateCounts);