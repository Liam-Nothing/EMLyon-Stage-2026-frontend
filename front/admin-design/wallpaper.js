const fill = document.getElementById('fillCard');
const fillP = document.getElementById('fillCardP');
const fillSelected = document.getElementById('fillSelected');

const gradient = document.getElementById('gradientCard');
const gradientP = document.getElementById('gradientCardP');
const gradientSelected = document.getElementById('gradientSelected');

fill.addEventListener('click', () => {
  fillP.classList.remove('unselected');
  gradientP.classList.add('unselected');
  fill.classList.add('selected');
  gradient.classList.remove('selected');

  fillSelected.style.display = "flex";
  gradientSelected.style.display = "none";
});

gradient.addEventListener('click', () => {
  fillP.classList.add('unselected');
  gradientP.classList.remove('unselected');
  gradient.classList.add('selected');
  fill.classList.remove('selected');

  fillSelected.style.display = "none";
  gradientSelected.style.display = "flex";
});

// BODY COLOR FILL
const bodyColor = document.getElementById('colorBodySelect');
const circleBodyColor = document.getElementById('circleBodyColor');
const nameBodyColor = document.getElementById('nameBodyColor');

bodyColor.addEventListener('input', () => {
circleBodyColor.style.background = bodyColor.value;
nameBodyColor.textContent = bodyColor.value;
});

// BACKGROUND COLOR FILL
const backgroundColor = document.getElementById('colorBackgroundSelect');
const circleBackgroundColor = document.getElementById('circleBackgroundColor');
const nameBackgroundColor = document.getElementById('nameBackgroundColor');

backgroundColor.addEventListener('input', () => {
circleBackgroundColor.style.background = backgroundColor.value;
nameBackgroundColor.textContent = backgroundColor.value;
});

// ADD GRADIENT
const add = document.getElementById('addGradient');
const container = document.getElementById('gradientContainer');
let compteur = 0;

function ajouterCarte() {
  if (compteur >= 3) {

    const toast = document.createElement('div');
    toast.classList.add('boxMessage');
    toast.innerHTML = "<p>" + "Maximum 3 couleurs !" + "</p>";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    return; // stop, on ne crée plus rien
  }

  compteur++;

  const gradientCard = document.createElement('div');
  gradientCard.classList.add('gradientCard');
  gradientCard.innerHTML = `
    <div class="leftGradientCard">
      <i class="fa-solid fa-grip-vertical"></i>
    </div>

    <div class="rightAlign">
      <div class="rightGradientCard">
        <label for="colorGradientSelect${compteur}">
          <span id="circleGradientColor${compteur}" class="circleColor"></span>
        </label>
        <input type="color" name="colorGradientSelect" id="colorGradientSelect${compteur}" value="#000000"> <!-- Have to be hidden -->

        <p id="nameBodyColor${compteur}">#000000</p>
      </div>

      <button class="deleteCard"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;

  container.appendChild(gradientCard);

 // GRADIENT CARD COLOR
  const gradientColor = document.getElementById(`colorGradientSelect${compteur}`);
  const gradientCircle = document.getElementById(`circleGradientColor${compteur}`);
  const gradientName = document.getElementById(`nameBodyColor${compteur}`);

  gradientColor.addEventListener('input', () => {
    gradientCircle.style.background = gradientColor.value;
    gradientName.textContent = gradientColor.value;
  });

}

add.addEventListener('click', () => {
  ajouterCarte();
});

// BODY COLOR GRADIENT
const bodyColors = document.getElementById('colorBodySelected');
const circleBodyColors = document.getElementById('circleBodyColors');
const nameBodyColors = document.getElementById('nameBodyColors');

bodyColors.addEventListener('input', () => {
circleBodyColors.style.background = bodyColors.value;
nameBodyColors.textContent = bodyColors.value;
});