/*
 * Script för kategorisidan. Hanterar filtrering, sortering och visning av produkter.
 */

// Hjälpfunktion för att läsa query-parametrar
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.slice(1);
  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
}

document.addEventListener('DOMContentLoaded', () => {
  const params = getQueryParams();
  const categoryTitle = document.getElementById('categoryTitle');
  const productList = document.getElementById('productList');
  const brandFilter = document.getElementById('brandFilter');
  const sizeFilter = document.getElementById('sizeFilter');
  const colorFilter = document.getElementById('colorFilter');
  const priceFilter = document.getElementById('priceFilter');
  const sortSelect = document.getElementById('sortSelect');

  const gender = params.gender || '';
  const category = params.category || '';

  // Sätt rubrik
  let title = '';
  if (gender) title += `${gender} `;
  if (category) title += category;
  categoryTitle.textContent = title || 'Alla produkter';

  // Filtrera produkter initialt efter kön och kategori
  let filtered = window.PRODUCTS.filter((p) => {
    const genderMatch = !gender || p.gender === gender || p.gender === 'Unisex';
    const categoryMatch = !category || p.category === category;
    return genderMatch && categoryMatch;
  });

  // Populera filteralternativ (varumärken, storlekar, färger)
  const brands = new Set();
  const sizes = new Set();
  const colors = new Set();
  filtered.forEach((p) => {
    brands.add(p.brand);
    p.sizes.forEach((s) => sizes.add(s));
    p.colors.forEach((c) => colors.add(c));
  });
  brands.forEach((b) => {
    const option = document.createElement('option');
    option.value = b;
    option.textContent = b;
    brandFilter.appendChild(option);
  });
  sizes.forEach((s) => {
    const option = document.createElement('option');
    option.value = s;
    option.textContent = s;
    sizeFilter.appendChild(option);
  });
  colors.forEach((c) => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    colorFilter.appendChild(option);
  });

  function applyFilters() {
    let results = [...filtered];
    const brand = brandFilter.value;
    const size = sizeFilter.value;
    const color = colorFilter.value;
    const maxPrice = priceFilter.value;
    if (brand) {
      results = results.filter((p) => p.brand === brand);
    }
    if (size) {
      results = results.filter((p) => p.sizes.includes(size));
    }
    if (color) {
      results = results.filter((p) => p.colors.includes(color));
    }
    if (maxPrice) {
      const priceVal = parseFloat(maxPrice);
      results = results.filter((p) => p.price <= priceVal);
    }
    const sort = sortSelect.value;
    if (sort === 'priceAsc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'nameAsc') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'nameDesc') {
      results.sort((a, b) => b.name.localeCompare(a.name));
    }
    renderProducts(results);
  }

  function renderProducts(list) {
    productList.innerHTML = '';
    list.forEach((product) => {
      const card = document.createElement('a');
      card.className = 'product-card';
      card.href = `product.html?id=${product.id}`;
      // Bild
      const img = document.createElement('img');
      img.src = product.images[0];
      img.alt = product.name;
      card.appendChild(img);
      // Info
      const info = document.createElement('div');
      info.className = 'product-info';
      const titleEl = document.createElement('h4');
      titleEl.textContent = product.name;
      info.appendChild(titleEl);
      const brandEl = document.createElement('p');
      brandEl.textContent = product.brand;
      info.appendChild(brandEl);
      const priceEl = document.createElement('span');
      priceEl.className = 'price';
      priceEl.textContent = `${product.price} kr`;
      info.appendChild(priceEl);
      card.appendChild(info);
      // Favorite knappen
      const favBtn = document.createElement('button');
      favBtn.className = 'favorite-button';
      const favsList = getFavorites();
      if (favsList.includes(product.id)) {
        favBtn.classList.add('active');
      }
      favBtn.innerHTML = favBtn.classList.contains('active') ? '❤' : '🤍';
      favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(product.id);
        const isActive = favBtn.classList.toggle('active');
        favBtn.innerHTML = isActive ? '❤' : '🤍';
      });
      card.appendChild(favBtn);
      // Quick view button
      const qvBtn = document.createElement('button');
      qvBtn.className = 'quick-view-btn';
      qvBtn.textContent = 'Snabbvy';
      qvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showQuickView(product);
      });
      card.appendChild(qvBtn);
      productList.appendChild(card);
    });
  }

  // Quick view functionality
  const overlay = document.getElementById('quickViewOverlay');
  const modal = document.getElementById('quickViewModal');
  const closeBtn = modal.querySelector('.quick-view-close');

  function showQuickView(product) {
    // Clear previous content
    modal.querySelectorAll('.modal-content').forEach((el) => el.remove());
    const content = document.createElement('div');
    content.className = 'modal-content';
    // Image
    const img = document.createElement('img');
    img.src = product.images[0];
    img.alt = product.name;
    content.appendChild(img);
    // Name and price
    const name = document.createElement('h3');
    name.textContent = product.name;
    content.appendChild(name);
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `${product.price} kr`;
    content.appendChild(price);
    // Short description
    const desc = document.createElement('p');
    desc.textContent = product.description;
    content.appendChild(desc);
    // Add to cart button
    const addBtn = document.createElement('button');
    addBtn.className = 'add-cart-modal';
    addBtn.textContent = 'Lägg i varukorg';
    addBtn.addEventListener('click', () => {
      // default to first size
      const size = product.sizes[0];
      addToCart(product.id, size, 1);
      addBtn.textContent = 'Tillagd!';
      setTimeout(() => {
        addBtn.textContent = 'Lägg i varukorg';
      }, 1500);
    });
    content.appendChild(addBtn);
    // Link to product page
    const link = document.createElement('a');
    link.href = `product.html?id=${product.id}`;
    link.textContent = 'Se detaljer';
    link.style.display = 'inline-block';
    link.style.marginTop = '10px';
    link.style.color = 'var(--accent)';
    content.appendChild(link);
    modal.appendChild(content);
    overlay.classList.add('active');
  }

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  // Eventlyssnare för filter och sortering
  brandFilter.addEventListener('change', applyFilters);
  sizeFilter.addEventListener('change', applyFilters);
  colorFilter.addEventListener('change', applyFilters);
  priceFilter.addEventListener('input', applyFilters);
  sortSelect.addEventListener('change', applyFilters);

  // Render initialt
  applyFilters();
});