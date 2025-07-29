/*
 * Script för favoritsidan. Visar alla sparade favoriter och låter
 * användaren ta bort dem eller navigera till produktsidan.
 */
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('wishlistItems');
  function renderWishlist() {
    const favs = getFavorites();
    listEl.innerHTML = '';
    if (favs.length === 0) {
      listEl.textContent = 'Du har inga favoriter ännu.';
      return;
    }
    const products = window.PRODUCTS.filter((p) => favs.includes(p.id));
    products.forEach((p) => {
      const card = document.createElement('a');
      card.className = 'product-card';
      card.href = `product.html?id=${p.id}`;
      const img = document.createElement('img');
      img.src = p.images[0];
      img.alt = p.name;
      card.appendChild(img);
      const info = document.createElement('div');
      info.className = 'product-info';
      const titleEl = document.createElement('h4');
      titleEl.textContent = p.name;
      info.appendChild(titleEl);
      const brandEl = document.createElement('p');
      brandEl.textContent = p.brand;
      info.appendChild(brandEl);
      const priceEl = document.createElement('span');
      priceEl.className = 'price';
      priceEl.textContent = `${p.price} kr`;
      info.appendChild(priceEl);
      card.appendChild(info);
      // ta bort favorit-knapp
      const favBtn = document.createElement('button');
      favBtn.className = 'favorite-button active';
      favBtn.innerHTML = '❤';
      favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(p.id);
        renderWishlist();
      });
      card.appendChild(favBtn);
      listEl.appendChild(card);
    });
  }
  renderWishlist();
});
