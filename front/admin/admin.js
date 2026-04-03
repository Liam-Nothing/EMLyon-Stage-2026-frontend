const addLink = document.getElementById('formulaire');
const buttonAdd = document.getElementById('addLink');
const main = document.querySelector('main');

addLink.style.display = 'none';

const centerDiv = document.createElement('div');

buttonAdd.addEventListener('click', () => {
  centerDiv.style.display = 'flex';
  centerDiv.style.alignItems = 'center';
  centerDiv.style.justifyContent = 'center';
  centerDiv.style.height = '100vh';
  centerDiv.style.position = 'fixed';
  centerDiv.style.top = '0';
  centerDiv.style.left = '0';
  centerDiv.style.width = '60%';
  centerDiv.style.background = '#00000053';

  // RESPONSIVE
  window.addEventListener('resize', () => {
    if (window.innerWidth < 769) {
      centerDiv.style.width = '100%';
    } else {
      centerDiv.style.width = '60%';
    }
  });

  // =========

  main.appendChild(centerDiv);

  addLink.style.display = 'flex';
  addLink.style.flexDirection = 'column';

  centerDiv.appendChild(addLink);
});

const cancelBtn = document.getElementById('btn-cancel');

cancelBtn.addEventListener('click', () => {
  addLink.style.display = 'none';
  centerDiv.style.display = 'none';
});

const btnAdd = document.getElementById('btn-add-link');
btnAdd.addEventListener('click', () => {
  addLink.style.display = 'none';
  centerDiv.style.display = 'none';
});