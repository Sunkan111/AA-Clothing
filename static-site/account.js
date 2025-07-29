/*
 * Script för kontosidan. Hanterar inloggning, registrering och visning av orderhistorik.
 */
document.addEventListener('DOMContentLoaded', () => {
  const contentEl = document.getElementById('accountContent');
  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
  function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  function renderLogin() {
    contentEl.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'account-wrapper';
    const loginBox = document.createElement('div');
    loginBox.className = 'account-box';
    loginBox.innerHTML = `<h2>Logga in</h2>
      <form id="loginForm">
        <label>E-post<br /><input type="email" id="loginEmail" required /></label>
        <label>Lösenord<br /><input type="password" id="loginPassword" required /></label>
        <button type="submit">Logga in</button>
      </form>
      <p id="loginMessage" class="message"></p>`;
    const registerBox = document.createElement('div');
    registerBox.className = 'account-box';
    registerBox.innerHTML = `<h2>Skapa konto</h2>
      <form id="registerForm">
        <label>Namn<br /><input type="text" id="registerName" required /></label>
        <label>E-post<br /><input type="email" id="registerEmail" required /></label>
        <label>Lösenord<br /><input type="password" id="registerPassword" required /></label>
        <button type="submit">Registrera</button>
      </form>
      <p id="registerMessage" class="message"></p>`;
    wrapper.appendChild(loginBox);
    wrapper.appendChild(registerBox);
    contentEl.appendChild(wrapper);
    // login-hantering
    document
      .getElementById('loginForm')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const users = getUsers();
        const user = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        const msg = document.getElementById('loginMessage');
        if (user) {
          saveCurrentUser({ name: user.name, email: user.email });
          renderAccount();
        } else {
          msg.textContent = 'Fel e-post eller lösenord.';
          msg.style.color = 'red';
        }
      });
    // register-hantering
    document
      .getElementById('registerForm')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const users = getUsers();
        const existing = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        const msg = document.getElementById('registerMessage');
        if (existing) {
          msg.textContent = 'Det finns redan ett konto med denna e-post.';
          msg.style.color = 'red';
          return;
        }
        users.push({ name, email, password });
        saveUsers(users);
        saveCurrentUser({ name, email });
        renderAccount();
      });
  }
  function renderAccount() {
    const user = getCurrentUser();
    if (!user) {
      renderLogin();
      return;
    }
    contentEl.innerHTML = '';
    const heading = document.createElement('h2');
    heading.textContent = `Hej, ${user.name}`;
    contentEl.appendChild(heading);
    // orderhistorik
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter((o) => o.customer.email === user.email);
    const section = document.createElement('div');
    section.innerHTML = '<h3>Mina beställningar</h3>';
    if (userOrders.length === 0) {
      section.innerHTML += '<p>Du har ännu inga beställningar.</p>';
    } else {
      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.paddingLeft = '0';
      userOrders.forEach((order) => {
        const li = document.createElement('li');
        li.style.marginBottom = '15px';
        const date = new Date(order.date).toLocaleDateString('sv-SE');
        li.innerHTML = `<strong>Order #${order.id}</strong> – ${date}<br />${order.items
          .map((item) => {
            const p = getProductById(item.id);
            return `${p.name} (${item.size}) x${item.quantity}`;
          })
          .join(', ')}`;
        list.appendChild(li);
      });
      section.appendChild(list);
    }
    contentEl.appendChild(section);
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logga ut';
    logoutBtn.style.marginTop = '20px';
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      renderLogin();
    });
    contentEl.appendChild(logoutBtn);
  }
  // Start
  renderAccount();
});
