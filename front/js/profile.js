// Gestion des états (loading / error / content)
function showState(state) {
  const main  = document.querySelector('main');
  const error = document.getElementById('error-state');

  if (state === 'loading') {
    main.style.opacity  = '0.4';
    main.style.pointerEvents = 'none';
    if (error) error.hidden = true;

  } else if (state === 'error') {
    main.style.opacity  = '1';
    main.style.pointerEvents = 'auto';
    if (error) error.hidden = false;

  } else if (state === 'content') {
    main.style.opacity  = '1';
    main.style.pointerEvents = 'auto';
    if (error) error.hidden = true;
  }
}

// Application des couleurs du thème
function applyThemeColors(colors) {
  if (!colors) return;
  const root = document.documentElement;

  if (colors.background)     root.style.setProperty('--color-background',   colors.background);
  if (colors.primary)        root.style.setProperty('--color-primary',       colors.primary);
  if (colors.cardBackground) root.style.setProperty('--color-surface',       colors.cardBackground);
  if (colors.textColor)      root.style.setProperty('--color-text-primary',  colors.textColor);
}

// Rendu de l'avatar
function renderAvatar(avatar) {
  const img = document.getElementById('profile-avatar');
  if (!img) return;

  if (avatar) {
    img.src = avatar;
  }
  // Si pas d'avatar, on laisse l'image par défaut déjà dans le HTML
}


// Rendu des liens — génère les link-cards avec ta structure HTML
function renderLinks(links) {
  const container = document.getElementById('links-container');
  if (!container) return;

  container.innerHTML = '';

  const activeLinks = links.filter(l => l.active);

  if (activeLinks.length === 0) {
    container.innerHTML = '<p style="text-align:center;opacity:0.5">Aucun lien disponible</p>';
    return;
  }

  activeLinks.forEach(link => {
    const clickable = document.createElement('a');
    clickable.href = link.url;
    clickable.target = "_blank";
    clickable.rel = "noopener noreferrer";
    const div = document.createElement('div');
    div.className = 'link-card link-style-solide';

    div.innerHTML = `
      <div class="left">
        <img src="assets/LogoJointInBlue.png" alt="${link.title}">
      </div>
      <div class="middle">
        <p>
          ${link.icon ? link.icon + ' ' : ''}${link.title}
        </p>
      </div>
      <div class="right"></div>
    `;

    container.appendChild(clickable);
    clickable.appendChild(div);
  });
}


// Chargement principal
async function loadProfile() {
  showState('loading');

  try {
    // Fetch profile et links en parallèle
    const [profileRes, linksRes] = await Promise.all([
      fetch('/api/profile'),
      fetch('/api/links'),
    ]);

    if (!profileRes.ok) throw new Error(`Profile: ${profileRes.status}`);
    if (!linksRes.ok)   throw new Error(`Links: ${linksRes.status}`);

    const profile = await profileRes.json();
    const links   = await linksRes.json();

    // Couleurs du thème
    applyThemeColors(profile.colors);

    // Nom
    const nameProfile = document.getElementById('profile-name');
    if (nameProfile && profile.name) nameProfile.textContent = profile.name;

    // Bio
    const bioProfile = document.getElementById('profile-bio');
    if (bioProfile && profile.bio) bioProfile.textContent = profile.bio;

    // Avatar
    renderAvatar(profile.avatar);

    // Liens
    renderLinks(links);

    showState('content');

  } catch (err) {
    console.error('[loadProfile]', err.message);
    showState('error');
  }
}

// Point d'entrée
document.addEventListener('DOMContentLoaded', loadProfile);