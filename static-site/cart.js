/*
 * Script för varukorgssidan. Visar produkter i varukorgen, låter användaren
 * ändra kvantitet eller ta bort varor och beräknar totalsumma.
 */

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
      cartItemsEl.textContent = 'Din varukorg är tom.';
      cartTotalEl.textContent = '';
      checkoutBtn.disabled = true;
      return;
    }
    checkoutBtn.disabled = false;
    cart.forEach((item, index) => {
      const product = getProductById(item.id);
      if (!product) return;
      const card = document.createElement('div');
      card.className = 'cart-item';
      const img = document.createElement('img');
      img.src = product.images[0];
      img.alt = product.name;
      card.appendChild(img);
      const info = document.createElement('div');
      info.className = 'cart-item-info';
      const title = document.createElement('h4');
      title.textContent = product.name;
      info.appendChild(title);
      const details = document.createElement('p');
      details.textContent = `Storlek: ${item.size} | Pris: ${product.price} kr`;
      info.appendChild(details);
      card.appendChild(info);
      const controls = document.createElement('div');
      controls.className = 'cart-item-controls';
      // antal
      const qtyInput = document.createElement('input');
      qtyInput.type = 'number';
      qtyInput.min = 1;
      qtyInput.value = item.quantity;
      qtyInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (val >= 1) {
          item.quantity = val;
          updateCart(cart);
        }
      });
      controls.appendChild(qtyInput);
      // ta bort
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Ta bort';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        updateCart(cart);
        renderCart();
      });
      controls.appendChild(removeBtn);
      card.appendChild(controls);
      cartItemsEl.appendChild(card);
      total += product.price * item.quantity;
    });
    cartTotalEl.textContent = `Totalt: ${total} kr`;
  }
  function updateCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  // hantera checkout
  checkoutBtn.addEventListener('click', () => {
    // Navigera till checkout-sida (skapa senare)
    window.location.href = 'checkout.html';
  });
  renderCart();
});
