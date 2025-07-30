/*
 * Script för kassa. Hanterar betalningsmetodsspecifik info och beställning.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Require user to be logged in before accessing the checkout. If no
  // currentUser exists in localStorage, save the intended redirect and
  // send the visitor to the account page. The product catalogue remains
  // accessible without login.
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) {
    // store the page we want to come back to
    localStorage.setItem('redirectTo', 'checkout.html');
    window.location.href = 'account.html';
    return;
  }
  const paymentSelect = document.getElementById('paymentMethod');
  const invoiceInfo = document.getElementById('invoiceInfo');
  const checkoutForm = document.getElementById('checkoutForm');
  const messageEl = document.getElementById('checkoutMessage');
  paymentSelect.addEventListener('change', () => {
    if (paymentSelect.value === 'invoice') {
      invoiceInfo.style.display = 'block';
    } else {
      invoiceInfo.style.display = 'none';
    }
  });
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // validera att varukorgen inte är tom
    const cart = getCart();
    if (cart.length === 0) {
      messageEl.textContent = 'Din varukorg är tom.';
      messageEl.style.color = 'red';
      return;
    }
    // spara order i localStorage (orderhistorik)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      id: Date.now(),
      items: cart,
      customer: {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
      },
      date: new Date().toISOString(),
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    // töm varukorgen
    localStorage.removeItem('cart');
    messageEl.textContent = 'Tack för din beställning! Du kommer få en bekräftelse via e-post.';
    messageEl.style.color = 'green';
    // ev. redirecta till tacksida efter några sekunder
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  });
});
