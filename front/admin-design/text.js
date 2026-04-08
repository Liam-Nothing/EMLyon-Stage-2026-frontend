const textColorInput  = document.getElementById('textColorSelect');
const circleTextColor = document.getElementById('circleTextColor');
const nameTextColor   = document.getElementById('nameTextColor');
const fontSelect      = document.getElementById('fontFamilySelect');

const user      = document.getElementById('usernamePreview');
const bio       = document.getElementById('bioPreview');
const foot      = document.getElementById('footer');
const stillFoot = document.getElementById('stillFooter');

const saveButton = document.getElementById('saveBtn');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');

let hasChanged   = false;
let history      = [];
let historyIndex = -1;

// Historique
function saveState() {
  const state = {
    textColor:  textColorInput.value,
    fontFamily: fontSelect.value,
  };
  history      = history.slice(0, historyIndex + 1);
  history.push(state);
  historyIndex++;
}

function applyState(state) {
  textColorInput.value              = state.textColor;
  circleTextColor.style.background  = state.textColor;
  nameTextColor.textContent         = state.textColor;
  applyTextColor(state.textColor);

  fontSelect.value = state.fontFamily;
  applyFontFamily(state.fontFamily);
}

function markChanged() {
  hasChanged = true;
  saveButton.classList.add('active');
}

// Application couleur texte 
function applyTextColor(color) {
  user.style.color      = color;
  bio.style.color       = color;
  foot.style.color      = color;
  stillFoot.style.color = color;

  // document.querySelectorAll('.myLinkPreview').forEach(el => {
  //   el.style.color = color;
  // });
}

// Application police 
function applyFontFamily(value) {
  const font = value === 'Default' ? '' : value;

  user.style.fontFamily      = value === 'Default' ? 'Rubik'     : font;
  bio.style.fontFamily       = value === 'Default' ? 'Noto Sans' : font;
  foot.style.fontFamily      = value === 'Default' ? 'Noto Sans' : font;
  stillFoot.style.fontFamily = value === 'Default' ? 'Noto Sans' : font;

  document.querySelectorAll('.myLinkPreview').forEach(el => {
    el.style.fontFamily = value === 'Default' ? 'Noto Sans' : font;
  });
}

// Listeners 
textColorInput.addEventListener('input', () => {
  circleTextColor.style.background = textColorInput.value;
  nameTextColor.textContent        = textColorInput.value;
  applyTextColor(textColorInput.value);
  markChanged();
  saveState();
});

fontSelect.addEventListener('change', () => {
  applyFontFamily(fontSelect.value);
  markChanged();
  saveState();
});

// Chargement initial depuis l'API 
fetch('/api/profile')
  .then(res => res.json())
  .then(data => {
    const c = data.colors || {};

    const color = c.textColor || '#000000';
    textColorInput.value             = color;
    circleTextColor.style.background = color;
    nameTextColor.textContent        = color;
    applyTextColor(color);

    console.log('fontFamily reçu:', data.fontFamily);  
    console.log('select avant set:', fontSelect.value); 


    if (data.fontFamily) {
      fontSelect.value = data.fontFamily;
      applyFontFamily(data.fontFamily);
      console.log('select après set:', fontSelect.value);
    }

    saveState(); 
  })
  .catch(err => console.error('Error server', err));

// Undo / Redo 
undoButton.addEventListener('click', () => {
  if (historyIndex <= 0) return;
  historyIndex--;
  applyState(history[historyIndex]);
});

redoButton.addEventListener('click', () => {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  applyState(history[historyIndex]);
});

// Sauvegarde 
saveButton.addEventListener('click', async () => {
  if (!hasChanged) {
    showNotification('Aucun changement à sauvegarder', '#FF5C72');
    return;
  }

  try {
    const res = await fetch('/api/profile', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fontFamily: fontSelect.value,
        colors: {
          textColor:  textColorInput.value,
        }
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