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
      <p id="loginMessage" class="message"></p>
      <div class="secondary-links">
        <a href="#" id="createAccountLink">Skapa konto</a> |
        <a href="#" id="forgotPasswordLink">Glömt lösenord</a>
      </div>`;
    wrapper.appendChild(loginBox);
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
          // If a redirect target was set (e.g. checkout), navigate there after login
          const redirectTo = localStorage.getItem('redirectTo');
          if (redirectTo) {
            localStorage.removeItem('redirectTo');
            window.location.href = redirectTo;
            return;
          }
          renderAccount();
        } else {
          msg.textContent = 'Fel e-post eller lösenord.';
          msg.style.color = 'red';
        }
      });
    // länkar för skapa konto och glömt lösenord
    const createLink = document.getElementById('createAccountLink');
    if (createLink) {
      createLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderRegister();
      });
    }
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderPasswordResetEmail();
      });
    }
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

  // Visa registreringsformuläret separat med tillbaka-länk till inloggningen
  function renderRegister() {
    contentEl.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'account-wrapper';
    const box = document.createElement('div');
    box.className = 'account-box';
    box.innerHTML = `<h2>Skapa konto</h2>
      <form id="registerForm">
        <label>Namn<br /><input type="text" id="registerName" required /></label>
        <label>E-post<br /><input type="email" id="registerEmail" required /></label>
        <label>Lösenord<br /><input type="password" id="registerPassword" required /></label>
        <button type="submit">Registrera</button>
      </form>
      <p id="registerMessage" class="message"></p>
      <div class="secondary-links"><a href="#" id="backToLogin">Tillbaka till logga in</a></div>`;
    wrapper.appendChild(box);
    contentEl.appendChild(wrapper);
    // hantera registrering
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      const users = getUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const msg = document.getElementById('registerMessage');
      if (existing) {
        msg.textContent = 'Det finns redan ett konto med denna e-post.';
        msg.style.color = 'red';
        return;
      }
      users.push({ name, email, password });
      saveUsers(users);
      saveCurrentUser({ name, email });
      // if there was a redirect (e.g. checkout), send there; otherwise render account
      const redirectToReg = localStorage.getItem('redirectTo');
      if (redirectToReg) {
        localStorage.removeItem('redirectTo');
        window.location.href = redirectToReg;
        return;
      }
      renderAccount();
    });
    // länk tillbaka till login
    document.getElementById('backToLogin').addEventListener('click', (e) => {
      e.preventDefault();
      renderLogin();
    });
  }

  // Steg 1 av lösenordsåterställning: be om e-post
  function renderPasswordResetEmail() {
    contentEl.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'account-box';
    box.innerHTML = `<h2>Glömt lösenord</h2>
      <form id="resetEmailForm">
        <label>E-post<br /><input type="email" id="resetEmail" required /></label>
        <button type="submit">Skicka kod</button>
      </form>
      <p id="resetEmailMessage" class="message"></p>
      <div class="secondary-links"><a href="#" id="backToLoginFromReset">Tillbaka till logga in</a></div>`;
    contentEl.appendChild(box);
    document.getElementById('resetEmailForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('resetEmail').value.trim();
      const users = getUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const msgEl = document.getElementById('resetEmailMessage');
      if (!user) {
        msgEl.textContent = 'Hittade inget konto med denna e-post.';
        msgEl.style.color = 'red';
        return;
      }
      // generera en 6-siffrig kod och spara tillsammans med e-post
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('resetCode', code);
      localStorage.setItem('resetEmail', email);
      // visa information till användaren (kod visas för demo)
      msgEl.textContent = `En återställningskod har skickats till din e-post. (Kod: ${code})`;
      msgEl.style.color = 'green';
      // fortsätt till nästa steg efter kort fördröjning
      setTimeout(() => {
        renderPasswordResetCode();
      }, 1000);
    });
    // återgå till login
    document.getElementById('backToLoginFromReset').addEventListener('click', (e) => {
      e.preventDefault();
      renderLogin();
    });
  }

  // Steg 2: be om återställningskod
  function renderPasswordResetCode() {
    contentEl.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'account-box';
    box.innerHTML = `<h2>Ange återställningskod</h2>
      <form id="resetCodeForm">
        <label>Kod<br /><input type="text" id="resetCodeInput" required /></label>
        <button type="submit">Verifiera</button>
      </form>
      <p id="resetCodeMessage" class="message"></p>
      <div class="secondary-links"><a href="#" id="backToLoginFromCode">Tillbaka till logga in</a></div>`;
    contentEl.appendChild(box);
    document.getElementById('resetCodeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = document.getElementById('resetCodeInput').value.trim();
      const code = localStorage.getItem('resetCode');
      const msgEl = document.getElementById('resetCodeMessage');
      if (entered === code) {
        renderPasswordResetNewPassword();
      } else {
        msgEl.textContent = 'Fel kod. Försök igen.';
        msgEl.style.color = 'red';
      }
    });
    document.getElementById('backToLoginFromCode').addEventListener('click', (e) => {
      e.preventDefault();
      // rensa tillfälliga data
      localStorage.removeItem('resetCode');
      localStorage.removeItem('resetEmail');
      renderLogin();
    });
  }

  // Steg 3: ställ in nytt lösenord
  function renderPasswordResetNewPassword() {
    contentEl.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'account-box';
    box.innerHTML = `<h2>Återställ lösenord</h2>
      <form id="newPasswordForm">
        <label>Nytt lösenord<br /><input type="password" id="newPassword" required /></label>
        <label>Bekräfta lösenord<br /><input type="password" id="confirmPassword" required /></label>
        <button type="submit">Uppdatera lösenord</button>
      </form>
      <p id="newPasswordMessage" class="message"></p>`;
    contentEl.appendChild(box);
    document.getElementById('newPasswordForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const newPw = document.getElementById('newPassword').value;
      const confirmPw = document.getElementById('confirmPassword').value;
      const msgEl = document.getElementById('newPasswordMessage');
      if (newPw !== confirmPw) {
        msgEl.textContent = 'Lösenorden matchar inte.';
        msgEl.style.color = 'red';
        return;
      }
      const email = localStorage.getItem('resetEmail');
      const users = getUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        msgEl.textContent = 'Ett fel inträffade. Försök igen.';
        msgEl.style.color = 'red';
        return;
      }
      user.password = newPw;
      saveUsers(users);
      // rensa återställningsdata
      localStorage.removeItem('resetCode');
      localStorage.removeItem('resetEmail');
      msgEl.textContent = 'Lösenordet är uppdaterat! Du kan nu logga in.';
      msgEl.style.color = 'green';
      setTimeout(() => {
        renderLogin();
      }, 1000);
    });
  }
  // Start
  renderAccount();
});
