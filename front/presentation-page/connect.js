const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  window.location.href = '../admin/admin.html';
});