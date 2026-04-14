const outline    = document.getElementById('shadowSection');
const solidBtn   = document.getElementById('solidBtn');
const outlineBtn = document.getElementById('outlineBtn');
const saveButton = document.getElementById('saveBtn');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');

const btnColor  = document.getElementById('colorButtonSelect');
const btnCircle = document.getElementById('circleButtonColor');
const btnName   = document.getElementById('nameButtonColor');

const textColor  = document.getElementById('colorTextBtnSelect');
const textCircle = document.getElementById('circleTextBtnColor');
const textName   = document.getElementById('nameTextBtnColor');

const square  = document.getElementById('squareRadius');
const round   = document.getElementById('roundRadius');
const rounder = document.getElementById('rounderRadius');
const full    = document.getElementById('fullRadius');

const none   = document.getElementById('noneShadow');
const soft   = document.getElementById('softShadow');
const strong = document.getElementById('strongShadow');
const hard   = document.getElementById('hardShadow');

let hasChanged   = false;
let history      = [];
let historyIndex = -1;

// Historique 
function saveState() {
  const state = {
    btnColor:   btnColor.value,
    textColor:  textColor.value,
    isSolid:    solidBtn.classList.contains('selected'),
    borderRadius: getCurrentRadius(),
    boxShadow:    getCurrentShadow(),
  };
  history      = history.slice(0, historyIndex + 1);
  history.push(state);
  historyIndex++;
}

function applyState(state) {
  btnColor.value  = state.btnColor;
  textColor.value = state.textColor;
  btnCircle.style.background  = state.btnColor;
  textCircle.style.background = state.textColor;
  btnName.textContent  = state.btnColor;
  textName.textContent = state.textColor;

  if (state.isSolid) {
    setSolid();
  } else {
    setOutline();
  }

  selectBordorRadius(state.borderRadius);
  selectShadow(state.boxShadow);
  updateLinkPreviewColor();
}

function getCurrentRadius() {
  if (square.classList.contains('selected'))  return '0px';
  if (round.classList.contains('selected'))   return '5px';
  if (rounder.classList.contains('selected')) return '15px';
  if (full.classList.contains('selected'))    return '50px';
  return '0px';
}

function getCurrentShadow() {
  if (soft.classList.contains('selected'))   return '3px 3px 6px rgba(0, 0, 0, 0.09)';
  if (strong.classList.contains('selected')) return '3px 3px 4px rgba(0, 0, 0, 0.25)';
  if (hard.classList.contains('selected'))   return '2px 3px 0 1px #000000';
  return 'none';
}

function markChanged() {
  hasChanged = true;
  saveButton.classList.add('active');
}

// Solid / Outline 
function setSolid() {
  solidBtn.classList.add('selected');
  solidBtn.classList.remove('unselected');
  outlineBtn.classList.add('unselected');
  outlineBtn.classList.remove('selected');
  outline.style.display = 'flex';
}

function setOutline() {
  outlineBtn.classList.add('selected');
  outlineBtn.classList.remove('unselected');
  solidBtn.classList.add('unselected');
  solidBtn.classList.remove('selected');
  outline.style.display = 'none';
}

solidBtn.addEventListener('click', () => {
  setSolid();
  updateLinkPreviewColor();
  markChanged();
  saveState();
});

outlineBtn.addEventListener('click', () => {
  setOutline();
  updateLinkPreviewColor();
  markChanged();
  saveState();
  selectShadow('none');
});

// Mise à jour preview liens 
function updateLinkPreviewColor() {
  const linkPreview = document.querySelectorAll('.linkPreview');
  linkPreview.forEach(el => {
    if (solidBtn.classList.contains('selected')) {
      el.style.background = btnColor.value;
      el.style.border     = 'none';
    } else {
      el.style.background = 'none';
      el.style.border     = '2px solid ' + btnColor.value;
    }
  });
}

// Couleur bouton 
btnColor.addEventListener('input', () => {
  btnCircle.style.background = btnColor.value;
  btnName.textContent        = btnColor.value;
  updateLinkPreviewColor();
  markChanged();
  saveState();
});

// Couleur texte 
textColor.addEventListener('input', () => {
  textCircle.style.background = textColor.value;
  textName.textContent        = textColor.value;
  document.querySelectorAll('.myLinkPreview').forEach(el => {
    el.style.color = textColor.value;
  });
  markChanged();
  saveState();
});

// Border radius
function radiusSelected(x, a, b, c, value) {
  x.addEventListener('click', () => {
    [a, b, c].forEach(el => el.classList.remove('selected'));
    x.classList.add('selected');
    document.querySelectorAll('.linkPreview').forEach(el => {
      el.style.borderRadius = value;
      el.style.boxShadow = value;
    });
    document.querySelectorAll('.leftPreview img').forEach(el => {
      el.style.borderRadius = value;
    });
    document.querySelectorAll('.rightPreview img').forEach(el => {
      el.style.borderRadius = value;
    });
    markChanged();
    saveState();
  });
}

function radiusAlreadySelected(x, a, b, c) {
  [a, b, c].forEach(el => el.classList.remove('selected'));
  x.classList.add('selected');
}

function selectBordorRadius(value) {
  if (value === '0px')  radiusAlreadySelected(square,  round,   rounder, full);
  if (value === '5px')  radiusAlreadySelected(round,   rounder, full,    square);
  if (value === '15px') radiusAlreadySelected(rounder, full,    square,  round);
  if (value === '50px') radiusAlreadySelected(full,    square,  round,   rounder);

  document.querySelectorAll('.linkPreview').forEach(el => {
    el.style.borderRadius = value;
  });
}

// Shadow 
function selectShadow(value) {
  const v = (value || '').trim().toLowerCase();
  if (v === 'none' || v === '')                           radiusAlreadySelected(none,   soft,   strong, hard);
  else if (v.includes('0.09'))                            radiusAlreadySelected(soft,   strong, hard,   none);
  else if (v.includes('0.25'))                            radiusAlreadySelected(strong, hard,   none,   soft);
  else if (v.includes('2px 3px 0'))                      radiusAlreadySelected(hard,   none,   soft,   strong);

  document.querySelectorAll('.linkPreview').forEach(el => {
    el.style.boxShadow = value || 'none';
  });
}

radiusSelected(square,  round,   rounder, full,   '0px');
radiusSelected(round,   rounder, full,    square,  '5px');
radiusSelected(rounder, full,    square,  round,   '15px');
radiusSelected(full,    square,  round,   rounder, '50px');

radiusSelected(none,   soft,   strong, hard,  'none');
radiusSelected(soft,   strong, hard,   none,  '3px 3px 6px rgba(0, 0, 0, 0.09)');
radiusSelected(strong, hard,   none,   soft,  '3px 3px 4px rgba(0, 0, 0, 0.25)');
radiusSelected(hard,   none,   soft,   strong,'2px 3px 0 1px #000000');

// Chargement initial depuis l'API
fetch('/api/profile/theme')
  .then(res => res.json())
  .then(data => {
    const c = data.colors || {};

    const isSolid = c.primary && c.primary !== 'transparent' && !c.primary.includes('none');
    btnColor.value  = isSolid ? c.primary : (c.border ? c.border.split(' ').pop() : '#4c7b8a'); // (c.btnBorderColor || '#4c7b8a')
    textColor.value = c.linkTextColor || '#000000';

    btnCircle.style.background  = c.primary       || '#000000';
    textCircle.style.background = c.linkTextColor || '#000000';
    btnName.textContent  = c.primary       || '#000000';
    textName.textContent = c.linkTextColor || '#000000';

    selectButtonSolidOutline(c.primary);
    selectBordorRadius(c.borderRadius || '0px');
    selectShadow(c.boxShadow || 'none');
    updateLinkPreviewColor();

    saveState(); 
  })
  .catch(err => console.error('Error server', err));

function selectButtonSolidOutline(value) {
  if (!value) return;
  // Si la valeur contient '#' → couleur hex → Solid
  // Sinon (transparent, none, etc.) → Outline
  if (value.trim().toLowerCase().includes('#') || value.trim().toLowerCase().startsWith('rgb')) {
    setSolid();
  } else {
    setOutline();
  }
}

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
    const isSolid = solidBtn.classList.contains('selected');

    const primaryValue = isSolid ? btnColor.value : 'transparent';
    const borderValue  = isSolid ? 'none' : `2px solid ${btnColor.value}`;

    const res = await fetch('/api/profile', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        colors: {
        primary:        primaryValue,
        border:         borderValue, //btnBorderColor: btnColor.value, //pb here might be 'solidBtn.classList.contains('selected') ? 'none' : btnColor.value,' or might be 'border' instead of 'btnBorderColor'
        linkTextColor:  textColor.value,
        borderRadius:   getCurrentRadius(),
        boxShadow:      getCurrentShadow(),
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
