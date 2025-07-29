/*
 * Script för sökresultatsidan. Hanterar filtrering och sortering av produkter baserat på söktermen.
 */

function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

document.addEventListener('DOMContentLoaded', () => {
  const query = getSearchQuery();
  const titleEl = document.getElementById('searchTitle');
  const resultsContainer = document.getElementById('searchResults');
  const sortSelect = document.getElementById('searchSort');

  // Set title based on search query
  if (query) {
    titleEl.textContent = `Sökresultat för "${query}"`;
  } else {
    titleEl.textContent = 'Alla produkter';
  }

  // Initial filter by search query
  let results = window.PRODUCTS.filter((p) => {
    const q = query.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q))
    );
  });

  function renderProducts(list) {
    resultsContainer.innerHTML = '';
    if (list.length === 0) {
      const msg = document.createElement('p');
      msg.textContent = 'Inga produkter matchar din sökning.';
      resultsContainer.appendChild(msg);
      return;
    }
    list.forEach((product) => {
      const card = document.createElement('a');
      card.className = 'product-card';
      card.href = `product.html?id=${product.id}`;

      const img = document.createElement('img');
      img.src = product.images[0];
      img.alt = product.name;
      card.appendChild(img);

      const info = document.createElement('div');
      info.className = 'product-info';
      const title = document.createElement('h4');
      title.textContent = product.name;
      info.appendChild(title);
      const brand = document.createElement('p');
      brand.textContent = product.brand;
      info.appendChild(brand);
      const priceEl = document.createElement('span');
      priceEl.className = 'price';
      priceEl.textContent = `${product.price} kr`;
      info.appendChild(priceEl);
      card.appendChild(info);

      // Favorite button
      const favBtn = document.createElement('button');
      favBtn.className = 'favorite-button';
      const favsList = getFavorites();
      if (favsList.includes(product.id)) {
        favBtn.classList.add('active');
      }
      favBtn.innerHTML = favBtn.classList.contains('active') ? '❤' : '';
      favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(product.id);
        const isActive = favBtn.classList.toggle('active');
        favBtn.innerHTML = isActive ? '❤' : '';
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

      resultsContainer.appendChild(card);
    });
  }

  function applySort() {
    const sort = sortSelect.value;
    let sorted = [...results];
    if (sort === 'priceAsc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === 'nameAsc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'nameDesc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    renderProducts(sorted);
  }

  sortSelect.addEventListener('change', applySort);

  // Quick view elements
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
    const nameEl = document.createElement('h3');
    nameEl.textContent = product.name;
    content.appendChild(nameEl);
    const priceEl2 = document.createElement('p');
    priceEl2.className = 'price';
    priceEl2.textContent = `${product.price} kr`;
    content.appendChild(priceEl2);
    // Short description
    const desc = document.createElement('p');
    desc.textContent = product.description;
    content.appendChild(desc);
    // Add to cart button
    const addBtn = document.createElement('button');
    addBtn.className = 'add-cart-modal';
    addBtn.textContent = 'Lägg i varukorg';
    addBtn.addEventListener('click', () => {
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
    
   link.textContent = 'Se detaljer';

    llink.href = 'product.html?id=' + product.id;
   
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

  // Initial render
  applySort();
});
