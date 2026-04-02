let themesData = [];
let selectedThemeId = null;
let history = [];
let historyIndex = -1;
let hasChanged = false; // ✅ état de modification

const container = document.getElementById('themeChoices');
const saveButton = document.getElementById('saveBtn');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');


// ======= FETCH THÈMES =======
fetch("/api/themes")
  .then(res => res.json())
  .then(data => {
    themesData = data;
    createCard(data);

    fetch("/api/profile")
      .then(res => res.json())
      .then(profile => {
        if (profile.theme) {
          selectTheme(profile.theme, false, true); // initial load
        }

        // ✅ IMPORTANT : état clean au chargement
        hasChanged = false;
        saveButton.classList.remove('active');
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
    card.addEventListener('click', () => {
      selectTheme(e.id, true);
    });

    container.appendChild(wrapper);
  });
}


// ======= SELECT THEME =======
function selectTheme(id, saveHistory = true, initialLoad = false) {
  document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
  const card = document.getElementById(id);
  if (card) card.classList.add('selected');

  applyTheme(id);
  selectedThemeId = id;

  if (!initialLoad) {
    hasChanged = true;
    saveButton.classList.add('active'); // ✅ ici seulement
  }

  if (saveHistory && !initialLoad) {
    history = history.slice(0, historyIndex + 1);
    history.push(id);
    historyIndex++;
  }

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
    btn.style.borderRadius = theme.colors.borderRadius;
    btn.style.border = theme.colors.border;
    btn.style.boxShadow = theme.colors.boxShadow;
  });

  textBtnLink.forEach(text => text.style.color = theme.colors.linkTextColor);
  imageLeft.forEach(img => img.style.borderRadius = theme.colors.borderRadius);
  imageRight.forEach(img => img.style.borderRadius = theme.colors.borderRadius);
}


// ======= SAVE =======
saveButton.addEventListener('click', () => {
  if (!hasChanged) {
    showNotification("Aucun changement à sauvegarder", "#FF5C72");
    return;
  }

  fetch("/api/profile/theme", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ themeId: selectedThemeId })
  })
  .then(res => res.json())
  .then(() => {
    showNotification("Thème sauvegardé", "#36D399");
    saveButton.classList.remove('active');
    hasChanged = false;
  })
  .catch(() => showNotification("Erreur lors de la sauvegarde", "#FF5C72"));
});


// ======= UNDO / REDO =======
undoButton.addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex--;
    selectTheme(history[historyIndex], false);
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
  saveButton.disabled = !selectedThemeId;
}


// ======= NOTIFICATION =======
function showNotification(msg, color) {
  const toast = document.createElement('div');
  toast.classList.add('boxMessage');
  toast.style.background = color;
  toast.innerHTML = "<p>" + msg + "</p>";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}