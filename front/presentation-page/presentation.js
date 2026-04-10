const menue = document.getElementById('menu');
const menuSection = document.querySelector('.menuPublic');

menue.addEventListener('click', () => {
  document.body.classList.toggle('remove-scrolling');
  menuSection.classList.toggle('toggled');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.body.classList.remove('remove-scrolling');
  menuSection.classList.remove('toggled');
  }
});