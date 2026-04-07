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
function renderAvatar(avatar, name) {
  const img = document.getElementById('profile-avatar');
  if (!img) return;

  if (avatar) {
    img.src = avatar;
  } else {
    // Affiche les initiales ou une silhouette quand l'utilisateur n'a pas une pfp
    const initials = (name || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    if (initials) {
      // Remplace l'img par un div avec les initiales
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 96px; height: 96px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 2rem; font-weight: bold;
        background: #40798C; color: #FFFEF9;
      `;
      placeholder.textContent = initials;
      img.replaceWith(placeholder);
    } else {
      // Silhouette générique
      img.src = `data:image/svg+xml,<svg viewBox="0 0 24 24" fill="%23aaa" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`;
    }
  }
}


// Rendu des liens
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

    // div.innerHTML = `
    //   // <div class="left" id="leftPreview">
    //   //   <img src="assets/LogoJointInBlue.png" alt="${link.title}">
    //   // </div>
    //   // <div class="middle" id="middlePreview">
    //   //   <p class="textBtn">
    //   //     ${link.icon ? link.icon + ' ' : ''}${link.title}
    //   //   </p>
    //   // </div>
    //   // <div class="right" id="rightPreview"></div>

    //   <div class="left leftPreview">
    //     ${link.image 
    //       ? `<img src="${link.image}" alt="${link.title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` 
    //       : link.icon 
    //       ? `<span style="font-size:1.4rem">${link.icon}</span>`
    //       : ''
    //     }
    //   </div>

    //   <div class="middle">
    //     <p class="textBtn">${link.title}</p>
    //   </div>
      
    //   <div class="right rightPreview"></div>
    // `;

    div.innerHTML = `
      <div class="left leftPreview">
        ${link.image 
          ? `<img src="${link.image}" alt="${link.title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` 
          : link.icon 
          ? `<span style="font-size:2rem">${link.icon}</span>`
          : ''
        }
      </div>

      <div class="middle">
        <p class="textBtn">${link.title}</p>
      </div>
      
      <div class="right rightPreview"></div>
    `;

    container.appendChild(clickable);
    clickable.appendChild(div);
  });
}


// APPLY COLOR ANOTHER WAY - TEST ======================================
// =====================================================================

function applyThemeApi() {
  fetch("/api/profile/theme")
  .then(response => response.json())
  .then(data => {
  
    const backgrounds = document.body;
    const card = document.getElementById('cardPreview');
    const h1 = document.getElementById('profile-name');
    const bio = document.getElementById('profile-bio');
    const footer = document.getElementById('footer');
    const foot = document.getElementById('stillFooter');
  
    const btnLink = document.querySelectorAll('.link-card');
    const textBtnLink = document.querySelectorAll('.textBtn');
    const imageLeft = document.querySelectorAll('.leftPreview');
    const imageRight = document.querySelectorAll('.rightPreview');
  
  
    backgrounds.style.backgroundColor = data.colors.background;
    card.style.background = data.colors.cardBackground;
    h1.style.color = data.colors.textColor;
    bio.style.color = data.colors.textColor;
    footer.style.color = data.colors.textColor;
    foot.style.color = data.colors.textColor;
    
    btnLink.forEach(btn => {
      btn.style.backgroundColor = data.colors.primary;
      btn.style.borderRadius = data.colors.borderRadius;
      btn.style.border = data.colors.border;
      btn.style.boxShadow = data.colors.boxShadow;
    });
  
    textBtnLink.forEach(text => {
      text.style.color = data.colors.linkTextColor;
    });
  
    imageLeft.forEach(img => {
      img.style.borderRadius = data.colors.borderRadius;
    });
  
    imageRight.forEach(img => {
      img.style.borderRadius = data.colors.borderRadius;
    });
  
  })
  
  .catch (error => {
    console.log('error : Fail to load colors', error);
  });

}


// =====================================================================

// Chargement principal
async function loadProfile() {
  showState('loading');

  try {
    const [profileRes, linksRes] = await Promise.all([
      fetch('/api/profile'),
      fetch('/api/links'),
    ]);

    if (!profileRes.ok) throw new Error(`Profile: ${profileRes.status}`);
    if (!linksRes.ok)   throw new Error(`Links: ${linksRes.status}`);

    const profile = await profileRes.json();
    const links   = await linksRes.json();

    // Couleurs du thème
    // applyThemeColors(profile.colors);
    applyThemeApi();

    // Nom
    const nameProfile = document.getElementById('profile-name');
    if (nameProfile && profile.name) nameProfile.textContent = profile.name;

    // Bio
    const bioProfile = document.getElementById('profile-bio');
    if (bioProfile && profile.bio) bioProfile.textContent = profile.bio;

    // Avatar
    renderAvatar(profile.avatar, profile.name);

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