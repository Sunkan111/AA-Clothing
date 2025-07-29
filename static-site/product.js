/*
 * Script för produktsidan. Visar detaljer för vald produkt,
 * låter användaren välja storlek och färg, lägga till i varukorg
 * samt spara som favorit. Visar även liknande produkter.
 */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = getProductById(id);
  if (!product) {
    document.querySelector('.product-container').textContent =
      'Produkten kunde inte hittas.';
    return;
  }
  // Fyll i produktinformation
  const nameEl = document.getElementById('productName');
  const brandEl = document.getElementById('productBrand');
  const priceEl = document.getElementById('productPrice');
  const descEl = document.getElementById('productDescription');
  const matEl = document.getElementById('productMaterial');
  const careEl = document.getElementById('productCare');
  nameEl.textContent = product.name;
  brandEl.textContent = product.brand;
  priceEl.textContent = `${product.price} kr`;
  descEl.textContent = product.description;
  matEl.textContent = product.material;
  careEl.textContent = product.care;
  // Bilder
  const mainImg = document.getElementById('mainImage');
  const thumbList = document.getElementById('thumbnailList');
  mainImg.src = product.images[0];
  product.images.forEach((url) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = product.name;
    img.addEventListener('click', () => {
      mainImg.src = url;
    });
    thumbList.appendChild(img);
  });
  // Varianter
  const sizeSelect = document.getElementById('sizeSelect');
  product.sizes.forEach((s) => {
    const option = document.createElement('option');
    option.value = s;
    option.textContent = s;
    sizeSelect.appendChild(option);
  });
  const colorSelect = document.getElementById('colorSelect');
  product.colors.forEach((c) => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    colorSelect.appendChild(option);
  });
  // Lagerstatus
  const stockEl = document.getElementById('stockStatus');
  function updateStock() {
    const selectedSize = sizeSelect.value;
    const qty = product.stock[selectedSize];
    if (qty > 0) {
      stockEl.textContent = `I lager: ${qty} st`;
      stockEl.style.color = 'green';
    } else {
      stockEl.textContent = 'Tillfälligt slut';
      stockEl.style.color = 'red';
    }
  }
  sizeSelect.addEventListener('change', updateStock);
  // Initiera med första storleken
  sizeSelect.value = product.sizes[0];
  colorSelect.value = product.colors[0];
  updateStock();
  // Favorite-knappen
  const favBtn = document.getElementById('favoriteBtn');
  const favs = getFavorites();
  let isFavorite = favs.includes(product.id);
  function refreshFavIcon() {
    favBtn.innerHTML = isFavorite ? '❤' : '🤍';
    favBtn.classList.toggle('active', isFavorite);
  }
  refreshFavIcon();
  favBtn.addEventListener('click', () => {
    toggleFavorite(product.id);
    isFavorite = !isFavorite;
    refreshFavIcon();
  });
  // Lägg i varukorg
  const addBtn = document.getElementById('addToCartBtn');
  addBtn.addEventListener('click', () => {
    const selectedSize = sizeSelect.value;
    if (!selectedSize) return;
    addToCart(product.id, selectedSize, 1);
    addBtn.textContent = 'Tillagd!';
    setTimeout(() => {
      addBtn.textContent = 'Lägg i varukorg';
    }, 1500);
  });
  // Relaterade produkter (samma kategori eller varumärke)
  const relatedList = document.getElementById('relatedList');
  const related = window.PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 4);
  related.forEach((p) => {
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
    // Favorite-knapp
    const favButton = document.createElement('button');
    favButton.className = 'favorite-button';
    const favList = getFavorites();
    if (favList.includes(p.id)) {
      favButton.classList.add('active');
    }
    favButton.innerHTML = favButton.classList.contains('active') ? '❤' : '🤍';
    favButton.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFavorite(p.id);
      const isActive = favButton.classList.toggle('active');
      favButton.innerHTML = isActive ? '❤' : '🤍';
    });
    card.appendChild(favButton);
    relatedList.appendChild(card);
  });
});
