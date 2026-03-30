let themesData = [];            // Stocke tous les thèmes
let selectedThemeId = null;     // ID du thème actuellement sélectionné
let history = [];               // Historique des sélections
let historyIndex = -1;          // Index dans l'historique

const container = document.getElementById('themeChoices');
const saveButton = document.getElementById('saveBtn');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');


// ======= FETCH THÈMES =======
fetch("../../back/data/themes.json")
  .then(res => res.json())
  .then(data => {
    themesData = data;
    createCard(data);

    // Charger le thème depuis le serveur
    fetch("/api/profile")
      .then(res => res.json())
      .then(profile => {
        if (profile.themeId) {
          selectTheme(profile.themeId, false, true); // initial load, pas d'historique
        }
      })
      .catch(() => console.log("Impossible de récupérer le thème du profil"));
  })
  .catch(err => console.error("Impossible de charger les thèmes", err));


// ======= CREATE CARDS =======
function createCard(data) {
  data.forEach(e => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('selectCard');

    wrapper.innerHTML = `
      <div class="card" style="background:${e.colors.cardBackground}" id="${e.id}">
        <div class="content">
          <div class="profil">
            <img src="../assets/Avatar_defaut.png" alt="">
            <span class="contentTitle" style="background:${e.colors.textColor}"></span>
            <div class="bio">
              <span class="contentBio" style="background:${e.colors.textColor}"></span>
              <span class="contentBio2" style="background:${e.colors.textColor}"></span>
            </div>
          </div>
          <div class="links">
            <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.borderRadius}; border:${e.colors.border}; box-shadow:${e.boxShadow}"></span>
            <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.borderRadius}; border:${e.colors.border}; box-shadow:${e.boxShadow}"></span>
            <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.borderRadius}; border:${e.colors.border}; box-shadow:${e.boxShadow}"></span>
          </div>
        </div>
        <div class="footerTheme">
          <span class="footTheme" style="background:${e.colors.textColor}"></span>
        </div>
      </div>
      <h3>${e.name}</h3>
    `;

    const card = wrapper.querySelector('.card');
    card.addEventListener('click', () => selectTheme(e.id, true));

    container.appendChild(wrapper);
  });
}


// ======= SELECT THEME =======
function selectTheme(id, saveHistory = true, initialLoad = false) {
  // 🔹 Visuel
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
  const card = document.getElementById(id);
  if (card) card.classList.add('active');

  // 🔹 Appliquer le thème
  applyTheme(id);

  selectedThemeId = id;

  // 🔹 Historique
  if (saveHistory && !initialLoad) {
    // si on était au milieu de l'historique, supprimer la suite
    history = history.slice(0, historyIndex + 1);
    history.push(id);
    historyIndex++;
  }

  // 🔹 Activer / désactiver boutons
  updateButtons();
}


// ======= APPLY THEME =======
function applyTheme(id) {
  const theme = themesData.find(t => t.id == id);
  if (!theme) return;

  const backgrounds = document.getElementById('backgroundColor');
  const cardPreview = document.getElementById('cardPreview');
  const h1 = document.getElementById('usernamePreview');
  const bio = document.getElementById('bioPreview');
  const footer = document.getElementById('footer');
  const foot = document.getElementById('stillFooter');
  const btnLink = document.querySelectorAll('.linkPreview');
  const textBtnLink = document.querySelectorAll('.myLinkPreview');
  const imageLeft = document.querySelectorAll('.leftPreview');
  const imageRight = document.querySelectorAll('.rightPreview');

  backgrounds.style.backgroundColor = theme.colors.background;
  cardPreview.style.background = theme.colors.cardBackground;
  h1.style.color = theme.colors.textColor;
  bio.style.color = theme.colors.textColor;
  footer.style.color = theme.colors.textColor;
  foot.style.color = theme.colors.textColor;

  btnLink.forEach(btn => {
    btn.style.backgroundColor = theme.colors.primary;
    btn.style.borderRadius = theme.borderRadius;
    btn.style.border = theme.colors.border;
    btn.style.boxShadow = theme.boxShadow;
  });

  textBtnLink.forEach(text => text.style.color = theme.colors.linkTextColor);
  imageLeft.forEach(img => img.style.borderRadius = theme.borderRadius);
  imageRight.forEach(img => img.style.borderRadius = theme.borderRadius);

  // 🔹 Activer bouton sauvegarder
  saveButton.classList.add('active');
}


// ======= BOUTON SAUVEGARDER =======
saveButton.addEventListener('click', () => {
  if (!selectedThemeId) {
    showNotification("Veuillez sélectionner un thème avant de sauvegarder ❌");
    return;
  }

  fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ themeId: selectedThemeId })
  })
  .then(res => res.json())
  .then(() => {
    showNotification("Thème sauvegardé ✅");
    saveButton.classList.remove('active'); // retirer après sauvegarde
  })
  .catch(() => showNotification("Erreur lors de la sauvegarde ❌"));
});


// ======= UNDO / REDO =======
undoButton.addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex--;
    selectTheme(history[historyIndex], false); // false = pas ajouter à l'historique
  }
});

redoButton.addEventListener('click', () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    selectTheme(history[historyIndex], false);
  }
});


// ======= UPDATE BUTTONS =======
function updateButtons() {
  undoButton.disabled = historyIndex <= 0;
  redoButton.disabled = historyIndex >= history.length - 1;
  saveButton.disabled = !selectedThemeId; // désactiver si rien sélectionné
}


// ======= NOTIFICATION SIMPLE =======
function showNotification(msg) {
  alert(msg); // tu peux remplacer par un toast stylé
}