const loginForm = document.getElementById('adminLoginForm');
const loginMessage = document.getElementById('loginMessage');
const DEFAULT_ADMIN_EMAIL = 'info@dropforafrica.com';
const DEFAULT_ADMIN_PASSWORD = 'qwerty123';

function saveToken(token) {
  localStorage.setItem('adminToken', token);
}

function redirectToDashboard() {
  window.location.href = 'admin.html';
}

function handleLocalLogin(email, password) {
  if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
    saveToken('offline-admin-token');
    redirectToDashboard();
    return true;
  }
  return false;
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMessage.textContent = '';

  const formData = new FormData(loginForm);
  const email = formData.get('email');
  const password = formData.get('password');

  if (handleLocalLogin(email, password)) {
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }
    saveToken(result.token);
    redirectToDashboard();
  } catch (error) {
    if (handleLocalLogin(email, password)) {
      return;
    }
    loginMessage.textContent = error.message || 'Unable to log in';
  }
});

if (localStorage.getItem('adminToken')) {
  redirectToDashboard();
}
