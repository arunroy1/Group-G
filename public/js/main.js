document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.logout-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        if (confirm('Are you sure you want to log out?')) {
          window.location.href = '/logout';
        }
      });
    });
  });  