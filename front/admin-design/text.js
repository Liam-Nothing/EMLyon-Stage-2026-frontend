const textColor = document.getElementById('textColorSelect');
const circleTextColor = document.getElementById('circleTextColor');
const nameTextColor = document.getElementById('nameTextColor');

textColor.addEventListener('input', () => {
  circleTextColor.style.background = textColor.value;
  nameTextColor.textContent = textColor.value;
});

const upSocial = document.getElementById('upBtn');
const downSocial = document.getElementById('downBtn');

upSocial.addEventListener('click', () => {
  downSocial.classList.remove('selected');
  upSocial.classList.add('selected');
});

downSocial.addEventListener('click', () => {
  downSocial.classList.add('selected');
  upSocial.classList.remove('selected');
});