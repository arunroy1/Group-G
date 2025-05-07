// debounce helper
function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // ==== Logout confirmation ====
    document.querySelectorAll('.logout-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
          window.location.href = '/logout';
        }
      });
    });
  
    const usernameInput = document.getElementById('username-input');
    const statusSpan    = document.getElementById('username-status');
  
    if (usernameInput && statusSpan) {
      const checkUsername = async () => {
        const name = usernameInput.value.trim();
        if (!name) {
          statusSpan.textContent = '';
          statusSpan.className = 'status';
          return;
        }
        try {
          const res = await fetch(`/check-username?username=${encodeURIComponent(name)}`);
          const { available } = await res.json();
          if (available) {
            statusSpan.textContent = '✓ Username is available';
            statusSpan.className = 'status available';
          } else {
            statusSpan.textContent = '✗ Username not available';
            statusSpan.className = 'status unavailable';
          }
        } catch (err) {
          console.error('Username check failed', err);
        }
      };
  
      usernameInput.addEventListener('input', debounce(checkUsername, 500));
    }
  });  