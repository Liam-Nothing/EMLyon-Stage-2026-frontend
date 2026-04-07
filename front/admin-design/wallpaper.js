const fill = document.getElementById('fillCard');
const fillP = document.getElementById('fillCardP');
const fillSelected = document.querySelector('.backgroundColor');

const gradient = document.getElementById('gradientCard');
const gradientP = document.getElementById('gradientCardP');
const gradientSelected = document.querySelector('.gradientColors');

let hasChanged = false;

fill.addEventListener('click', () => {
  fillP.classList.remove('unselected');
  gradientP.classList.add('unselected');
  fill.classList.add('selected');
  gradient.classList.remove('selected');

  fillSelected.style.display = "block";
  gradientSelected.style.display = "none";
});

gradient.addEventListener('click', () => {
  fillP.classList.add('unselected');
  gradientP.classList.remove('unselected');
  gradient.classList.add('selected');
  fill.classList.remove('selected');

  fillSelected.style.display = "none";
  gradientSelected.style.display = "block";

  //myb a function here for if theme plane, and click gradient, add plane color with default gradient
  const currentBg = cardPreview.style.background || backgroundColor.value;

  // 👉 si c'est une couleur simple
  if (!currentBg.includes('gradient')) {
    createSingleColorCard(currentBg);
  }
});

// BODY COLOR FILL
const bodyColor = document.getElementById('colorBodySelect');
const circleBodyColor = document.getElementById('circleBodyColor');
const nameBodyColor = document.getElementById('nameBodyColor');
const bnacPreview = document.getElementById('backgroundColor');

bodyColor.addEventListener('input', () => {
circleBodyColor.style.background = bodyColor.value;
nameBodyColor.textContent = bodyColor.value;
bnacPreview.style.background = bodyColor.value;

hasChanged = true;
saveButton.classList.add('active');
saveState();
});

// BACKGROUND COLOR FILL
const backgroundColor = document.getElementById('colorBackgroundSelect');
const circleBackgroundColor = document.getElementById('circleBackgroundColor');
const nameBackgroundColor = document.getElementById('nameBackgroundColor');

backgroundColor.addEventListener('input', () => {
circleBackgroundColor.style.background = backgroundColor.value;
nameBackgroundColor.textContent = backgroundColor.value;
cardPreview.style.background = backgroundColor.value;

hasChanged = true;
saveButton.classList.add('active');
saveState();
});

// ADD GRADIENT
const add = document.getElementById('addGradient');
const container = document.getElementById('gradientContainer');
let compteur = 0;

function ajouterCarte(defaultColor = "#000000") {
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
  gradientCard.draggable = "true";
  gradientCard.innerHTML = `
    <div class="leftGradientCard" draggable="true">
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

  // ⚡ Important : valeur initiale
  gradientColor.value = defaultColor;
  gradientCircle.style.background = defaultColor;
  gradientName.textContent = defaultColor;

  // Event listener
  gradientColor.addEventListener('input', () => {
    gradientCircle.style.background = gradientColor.value;
    gradientName.textContent = gradientColor.value;
    updateGradientPreview(); // rebuild le gradient avec toutes les cartes
  });

  // 🔥 Mettre à jour le preview après création
  updateGradientPreview();
}

add.addEventListener('click', () => {
  ajouterCarte();
});

// // BODY COLOR GRADIENT
// const bodyColors = document.getElementById('colorBodySelected');
// const circleBodyColors = document.getElementById('circleBodyColors');
// const nameBodyColors = document.getElementById('nameBodyColors');

// bodyColors.addEventListener('input', () => {
// circleBodyColors.style.background = bodyColors.value;
// nameBodyColors.textContent = bodyColors.value;
// });

const cardPreview = document.getElementById('cardPreview');


fetch("/api/profile/theme")
  .then(res => res.json())
  .then(data => {
    const colorValue = data.colors.cardBackground;

    // 🎯 Sélection bouton (gradient ou couleur)
    selectButtonBasedOnColor(colorValue);

    // 🎨 Background des boutons preview
    fill.style.background = getColorFromBackground(colorValue);
    gradient.style.background = getBackground(colorValue);

    // 🎯 RESET des cartes gradient
    container.innerHTML = "";
    compteur = 0;

    // 🎯 Récupérer les couleurs du gradient
    const gradientColors = getGradientColors(colorValue);

    // 🎯 Créer les cartes SI gradient
    if (gradientColors.length > 0) {
      gradientColors.forEach(color => {
        ajouterCarte(color);
      });
    }

    // 🎨 BODY COLOR
    if (bnacPreview) {
      nameBodyColor.textContent = getHexIfPlainColor(data.colors.background);
      circleBodyColor.style.background = data.colors.background;
      bnacPreview.style.background = data.colors.background;
    }

    // 🎨 CARD COLOR
    if (cardPreview) {
      nameBackgroundColor.textContent = getColorFromBackground(colorValue);
      circleBackgroundColor.style.background = getColorFromBackground(colorValue);
      cardPreview.style.background = colorValue;
    }

    // Sauvegarder l'état initial
    saveState();
  })
  .catch(err => console.error('Error server', err));


function getColorFromBackground(bgValue)  {
  // Si ce n'est pas un gradient, on retourne directement
  if (!bgValue.startsWith('linear-gradient')) return bgValue;

  // Regex pour trouver toutes les couleurs (hex, rgb(a), hsl(a))
  const colorRegex = /(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\))/g;

  const colors = bgValue.match(colorRegex);

  if (colors && colors.length >= 2) {
      return colors[1]; // deuxième couleur
  } else if (colors && colors.length === 1) {
      return colors[0]; // fallback si une seule couleur
  }

  return bgValue; // fallback si aucune couleur détectée
}



function getBackground(bgValue) {
    // Vérifier si c'est un gradient
    if (bgValue.startsWith('linear-gradient')) {
        // C'est déjà un gradient → on le garde
        return bgValue;
    } else {
        // C'est une couleur unie → créer un gradient par défaut
        // Par exemple du bgValue vers une couleur légèrement plus claire
        return `linear-gradient(0deg, ${bgValue}, ${bgValue}99)`; 
        // ${bgValue}99 ajoute un peu de transparence pour l'effet gradient
    }
}

function getHexIfPlainColor(value) {
    if (!value) return '';

    // Si ça commence par "linear-gradient", ce n'est pas une couleur unie
    if (value.startsWith('linear-gradient')) {
        return ''; // ne rien retourner pour les gradients
    }

    // Sinon c'est une couleur unie → on retourne le hex / valeur telle quelle
    return value;
}


function selectButtonBasedOnColor(value) {
    if (!value) return;

    const normalized = value.trim().toLowerCase();

    if (normalized.includes('gradient')) {
        // Gradient
        fillP.classList.add('unselected');
        gradientP.classList.remove('unselected');
        gradient.classList.add('selected');
        fill.classList.remove('selected');

        fillSelected.style.display = "none";
        gradientSelected.style.display = "block";
    } else {
        // Couleur simple
        fillP.classList.remove('unselected');
        gradientP.classList.add('unselected');
        fill.classList.add('selected');
        gradient.classList.remove('selected');

        fillSelected.style.display = "block";
        gradientSelected.style.display = "none";
    }
}

function getGradientColors(bgValue) {
  if (!bgValue) return [];

  const normalized = bgValue.trim().toLowerCase();

  if (!normalized.includes('gradient')) return [];

  const colorRegex = /(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\))/g;

  const colors = bgValue.match(colorRegex);

  return colors ? colors.slice(0, 3) : []; // max 3 couleurs
}

function getBackground(bgValue) {
    // Vérifier si c'est un gradient
    if (bgValue.startsWith('linear-gradient')) {
        // C'est déjà un gradient → on le garde
        return bgValue;
    } else {
        // C'est une couleur unie → créer un gradient par défaut
        // Par exemple du bgValue vers une couleur légèrement plus claire
        return `linear-gradient(180deg, ${bgValue}, ${bgValue}99)`; 
        // ${bgValue}99 ajoute un peu de transparence pour l'effet gradient
    }
}

function createSingleColorCard(color) {
  // reset
  container.innerHTML = "";
  compteur = 0;

  // créer UNE seule carte
  ajouterCarte(color);

  // optionnel : appliquer un faux gradient visuel
  const gradientValue = getBackground(color);
  cardPreview.style.background = gradientValue;
}

function updateGradientPreview() {
  const inputs = container.querySelectorAll('input[type="color"]');
  const colors = Array.from(inputs).map(input => input.value);

  if (colors.length === 0) return;

  if (colors.length === 1) {
    // 1 couleur → gradient par défaut 180deg
    cardPreview.style.background = `linear-gradient(180deg, ${colors[0]}, ${colors[0]}99)`;
  } else {
    // plusieurs couleurs → gradient 180deg
    cardPreview.style.background = `linear-gradient(180deg, ${colors.join(', ')})`;
  }

  if (historyIndex >= 0) { 
    hasChanged = true;
    saveButton.classList.add('active');
  }
}

// DRAG
function initDragAndDrop() {
  let draggedCard = null;

  container.addEventListener('dragstart', (e) => {
    const handle = e.target.closest('.leftGradientCard');
    if (!handle) return;

    draggedCard = handle.closest('.gradientCard');
    if (!draggedCard) return;

    // 🔥 FIX IMPORTANT
    e.dataTransfer.setData('text/plain', 'dragging');

    e.dataTransfer.effectAllowed = 'move';
    draggedCard.classList.add('dragging');
  });

  container.addEventListener('dragend', () => {
    if (draggedCard) draggedCard.classList.remove('dragging');
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();

    const target = e.target.closest('.gradientCard');
    if (!target || target === draggedCard) return;

    const rect = target.getBoundingClientRect();
    const isAfter = e.clientY > rect.top + rect.height / 2;

    if (isAfter) {
      target.after(draggedCard);
    } else {
      target.before(draggedCard);
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();

    if (!draggedCard) {
      console.log("❌ draggedCard NULL");
      return;
    }

    console.log("✅ drop OK");

    updateGradientPreview();
  });
}

initDragAndDrop();

// NEED ADD SAVE BUTTON SO IT SAVES CHANGES IN API

const saveButton = document.getElementById('saveBtn');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');


// TOAST 

function showNotification(msg, color) {
  const toast = document.createElement('div');
  toast.classList.add('boxMessage');
  toast.style.background = color;
  toast.innerHTML = "<p>" + msg + "</p>";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Historique pour undo/redo
let history = [];
let historyIndex = -1;

function saveState() {
  const state = {
    background: bnacPreview.style.background,
    cardBackground: cardPreview.style.background,
  };
  // Supprimer les états après l'index actuel
  history = history.slice(0, historyIndex + 1);
  history.push(state);
  historyIndex++;
}

function applyState(state) {
  bnacPreview.style.background = state.background;
  cardPreview.style.background  = state.cardBackground;
  nameBodyColor.textContent       = state.background;
  circleBodyColor.style.background = state.background;
  nameBackgroundColor.textContent  = getColorFromBackground(state.cardBackground);
  circleBackgroundColor.style.background = getColorFromBackground(state.cardBackground);
}



// Sauvegarder après chaque changement de couleur
bodyColor.addEventListener('change', saveState);
backgroundColor.addEventListener('change', saveState);

// Undo
undoButton.addEventListener('click', () => {
  if (historyIndex <= 0) return;
  historyIndex--;
  applyState(history[historyIndex]);
});

// Redo
redoButton.addEventListener('click', () => {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  applyState(history[historyIndex]);
});


saveButton.addEventListener('click', async () => {
  if (!hasChanged) {
    showNotification('Aucun changement à sauvegarder', '#FF5C72');
    return;
  }

  const background     = bnacPreview.style.background;
  const cardBackground = cardPreview.style.background;

  try {
    const res = await fetch('/api/profile', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        colors: { background, cardBackground }
      }),
    });

    if (!res.ok) throw new Error('Erreur API');
    showNotification('Sauvegardé ✓', '#36D399');
    hasChanged = false;
    saveButton.classList.remove('active');

  } catch (e) {
    console.error(e);
    showNotification('Erreur lors de la sauvegarde', '#FF5C72');
  }
});