import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

// Elements
const logoutBtn = document.getElementById('logout-btn');
const userEmailEl = document.getElementById('user-email');

// If DOM not ready (script may be loaded early), wait
function ready(fn){
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
  // Watch auth state
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Not logged in -> redirect to login page
      window.location.href = 'login.html';
      return;
    }

    // show user email and logout button
    if (userEmailEl) { userEmailEl.textContent = user.email || 'User'; userEmailEl.style.display = 'inline-block'; }
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  });

  // Logout handler
  if (logoutBtn){
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
        alert('Logged out successfully!');
        window.location.href = 'login.html';
      } catch (err) {
        console.error('Logout error', err);
        alert('Error logging out: ' + (err.message || err));
      }
    });
  }
});
