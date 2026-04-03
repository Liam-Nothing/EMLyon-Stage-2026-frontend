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



function modifyLink() {
  const modify = document.createElement('div');
  modify.classList.add('modifyImgCard');
  modify.innerHTML = `
  <div class="navModify">
    <p id="imageSetting">Image setting</p>
    <p id="imageLayout">Layout</p>
  </div>

  <div class="image-setting" id="image-setting">
    <div class="imageDisplay" id="imageDisplay"></div>
    <div class="changeDiv">
      <label for="change">Change</label>
      <input type="file" name="change" id="change" class="change" accept="image/png, image/jpeg">
    </div>
    <div class="changeDiv">
      <label for="remove">Remove</label>
      <input type="file" name="remove" id="remove" class="remove" accept="image/png, image/jpeg">
    </div>
  </div>

  <div class="image-layout" id="image-layout">
    <form action="" method="get" class="layoutStyle">
        <div class="options" id="option1">
            <div class="check">
                <input type="radio" name="option" id="leftOption">
                <label for="leftOption">Left</label>
            </div>
            <img src="../assets/imgleft.png" alt="option1">
        </div>
        <div class="options" id="option2">
            <div class="check">
                <input type="radio" name="option" id="rightOption">
                <label for="rightOption">Right</label>
            </div>
            <img src="../assets/imgright.png" alt="option2">
        </div>
    </form>
  </div>
  `;
}


const imgModify = document.getElementById('image-btn');

imgModify.addEventListener('click', () => {
  
});