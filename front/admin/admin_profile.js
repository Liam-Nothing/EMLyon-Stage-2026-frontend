// Toast notification

// function showToast(message, type = 'success') {
//   const existing = document.getElementById('toast');
//   if (existing) existing.remove();

//   const toast = document.createElement('div');
//   toast.id = 'toast';
//   toast.textContent = message;
//   toast.style.cssText = `
//     position: fixed;
//     bottom: 24px;
//     right: 24px;
//     padding: 12px 20px;
//     border-radius: 8px;
//     font-size: 0.9rem;
//     font-weight: 500;
//     color: #fff;
//     background: ${type === 'success' ? '#36D399' : '#FF5C72'};
//     box-shadow: 0 4px 16px rgba(0,0,0,0.2);
//     z-index: 9999;
//     animation: slideIn 0.3s ease;
//   `;

//   if (!document.getElementById('toast-style')) {
//     const style = document.createElement('style');
//     style.id = 'toast-style';
//     style.textContent = `
//       @keyframes slideIn {
//         from { opacity: 0; transform: translateY(12px); }
//         to   { opacity: 1; transform: translateY(0); }
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   document.body.appendChild(toast);
//   setTimeout(() => toast.remove(), 3000);
// }

function setLoading(button, isLoading) {
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.innerHTML = `<span style="
      display:inline-block;
      width:14px; height:14px;
      border:2px solid #fff;
      border-top-color:transparent;
      border-radius:50%;
      animation:spin 0.6s linear infinite;
      vertical-align:middle;
    "></span>`;
    button.disabled = true;
    button.style.opacity = '0.7';
  } else {
    button.innerHTML = button.dataset.originalText;
    button.disabled  = false;
    button.style.opacity = '1';
  }
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed; top: 24px; right: 24px;
      display: flex; flex-direction: column; gap: 8px;
      z-index: 9999;
    `;
    document.body.appendChild(container);
  }

  const icon  = type === 'success' ? '✓' : '✕';
  const color = type === 'success' ? '#36D399' : '#FF5C72';

  const toast = document.createElement('div');
  toast.style.cssText = `
    display: flex; align-items: center; gap: 10px;
    padding: 12px 20px; border-radius: 8px;
    font-size: 0.9rem; font-weight: 500; color: #fff;
    background: ${color};
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    animation: toastIn 0.3s ease;
    transition: opacity 0.4s ease;
  `;
  toast.innerHTML = `<span style="font-weight:700;font-size:1rem">${icon}</span> ${message}`;

  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(20px); }
        to   { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}



function showFieldError(inputEl, message) {
  inputEl.style.borderColor = '#FF5C72';
  let errorEl = inputEl.parentElement.querySelector('.error-message');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.style.cssText = 'color:#FF5C72;font-size:0.8rem;margin-top:4px;display:block;animation:fadeIn 0.2s ease';
    inputEl.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
  inputEl.addEventListener('input', () => clearFieldError(inputEl), { once: true });
}



function clearFieldError(inputEl) {
  inputEl.style.borderColor = '';
  const errorEl = inputEl.parentElement.querySelector('.error-message');
  if (errorEl) errorEl.textContent = '';
}



// Chargement du profil depuis l'API
async function loadProfile() {
  try {
    const res     = await fetch('/api/profile');
    const profile = await res.json();

    // Carte d'affichage
    document.querySelector('.nomProfil p').textContent = `Nom : ${profile.name || ''}`;
    document.querySelector('.bioProfil p').textContent = `Bio : ${profile.bio  || ''}`;

    // Pré-remplir les champs du formulaire
    document.getElementById('name').value = profile.name || '';
    document.getElementById('bio').value  = profile.bio  || '';

    // Avatar
    if (profile.avatar) {
      document.querySelectorAll('.cardProfil img, .image-modify img').forEach(img => {
        img.src = profile.avatar;
      });
    }

  } catch (err) {
    console.error('[loadProfile]', err.message);
    showToast('Impossible de charger le profil', 'error');
  }
}



// Sauvegarde via PUT /api/profile
async function saveProfile() {
  const nameInput = document.getElementById('name');
  const bioInput  = document.getElementById('bio');
  const name   = document.getElementById('name').value.trim();
  const bio    = document.getElementById('bio').value.trim();
  const avatar = window._pendingAvatar || undefined;

  // Validation côté client
  if (name && name.length > 50) {
    showFieldError(nameInput, `Nom trop long (${name.length}/50 caractères)`);
    return;
  }
  if (bio && bio.length > 160) {
    showFieldError(bioInput, `Bio trop longue (${bio.length}/160 caractères)`);
    return;
  }

  // if (name && name.length > 50) {
  //   showToast('Le nom ne peut pas dépasser 50 caractères', 'error');
  //   return;
  // }
  // if (bio && bio.length > 160) {
  //   showToast('La bio ne peut pas dépasser 160 caractères', 'error');
  //   return;
  // }

  const body = {};
  if (name)   body.name   = name;
  if (bio)    body.bio    = bio;
  if (avatar) body.avatar = avatar;

  const btnSave = document.querySelector('.btn-main.save');
  setLoading(btnSave, true);
  try {
    const res  = await fetch('/api/profile', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || 'Erreur lors de la sauvegarde', 'error');
      return;
    }

    // Mettre à jour la carte d'affichage
    document.querySelector('.nomProfil p').textContent = `Nom : ${data.name || ''}`;
    document.querySelector('.bioProfil p').textContent = `Bio : ${data.bio  || ''}`;

    window._pendingAvatar = null;
    showToast('Profil sauvegardé ✓');

  } catch (err) {
    console.error('[saveProfile]', err.message);
    showToast('Erreur réseau, réessayez', 'error');
  } finally {
    setLoading(btnSave, false);
  }
}



// Upload avatar (base64)
function initAvatarUpload() {
  const input = document.getElementById('pfp');
  if (!input) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation format
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format non supporté. Utilise JPG, PNG, GIF ou WEBP.', 'error');
      input.value = '';
      return;
    }

    // Validation taille (2MB max)
    const maxSize = 2 * 1024 * 1024; 
    if (file.size > maxSize) {
      showToast(`Image trop lourde (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum 2MB.`, 'error');
      input.value = '';
      return;
    }

    const reader = new FileReader();

    if (!window._originalAvatar) {
      const current = document.querySelector(".pfpPreview img");
      if (current) window._originalAvatar = current.src;
    }

    reader.onload = (ev) => {
      const base64 = ev.target.result;

      // Prévisualisation immédiate
      document.querySelectorAll('.cardProfil img, .image-modify img').forEach(img => {
        img.src = base64;
      });

      // 👉 AJOUT ICI
      const preview = document.querySelector(".pfpPreview img");
      if (preview) preview.src = base64;

      // Stocker en mémoire jusqu'à la sauvegarde
      window._pendingAvatar = base64;
      showToast('Avatar prêt — clique sur Sauvegardé pour confirmer');
    };
    reader.readAsDataURL(file);
  });
}


// Boutons + compteur bio
function initButtons() {
  // Sauvegardé
  const btnSave = document.querySelector('.btn-main.save');
  if (btnSave) {
    btnSave.addEventListener('click', (e) => {
      e.preventDefault();
      saveProfile();
      editCard.style.display = "none";
    });
  }

  // Annulé — recharge depuis l'API
  const btnCancel = document.querySelector('.btn-discard');
  if (btnCancel) {
    btnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      editCard.style.display = "none";
      window._pendingAvatar = null;

       // 👉 RESTAURATION
      if (window._originalAvatar) {
        document.querySelectorAll('.cardProfil img, .image-modify img').forEach(img => {
          img.src = window._originalAvatar;
        });

        const preview = document.querySelector(".pfpPreview img");
        if (preview) preview.src = window._originalAvatar;
      }

      loadProfile();
      showToast('Modifications annulées');
    });
  }

  // Compteur bio — orange à 140, rouge à 160
  const bioInput = document.getElementById('bio');
  if (bioInput) {
    bioInput.addEventListener('input', () => {
      clearFieldError(bioInput);
      const len = bioInput.value.length;
      bioInput.style.borderColor = len > 160 ? '#FF5C72' : len > 140 ? '#f0a500' : '';
    });
  }
}

// LOAD PREVIEW CARD =========================================
async function renderPreview() {
  try {
    const [profileRes, linksRes] = await Promise.all([
      fetch('/api/profile'),
      fetch('/api/links'),
    ]);
    const profile = await profileRes.json();
    const links   = await linksRes.json();

    const pfp = document.getElementById('pfpPreview');
    // if (pfp) {
    //   const img = pfp.querySelector('img');
    //   if (img) img.src = profile.avatar || '';
    // }
    if (pfp) {
      if (profile.avatar) {
        const img = pfp.querySelector('img');
        if (img) img.src = profile.avatar;
      } else {
        const initials = (profile.name || '')
        .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    
        const h = [...(profile.name || '')].reduce((hash, c) => 
        c.charCodeAt(0) + ((hash << 5) - hash), 0);
        const color = `hsl(${Math.abs(h) % 360}, 50%, 40%)`;

        pfp.innerHTML = `
          <div style="
          width:80px; height:80px; border-radius:50%;
          background:${color}; color:#fff;
          display:flex; align-items:center; justify-content:center;
          font-size:1.8rem; font-weight:bold;
          ">${initials || '?'}</div>
        `;
      }
    }

    const nameEl = document.getElementById('usernamePreview');
    const bioEl  = document.getElementById('bioPreview');
    if (nameEl) nameEl.textContent = profile.name || '';
    if (bioEl)  bioEl.textContent  = profile.bio  || '';

    // Police
    if (profile.fontFamily) {
      document.querySelectorAll('#usernamePreview, #bioPreview, .myLinkPreview').forEach(el => {
        el.style.fontFamily = profile.fontFamily;
      });
    }

    const container = document.getElementById('linkContainerPreview');
    if (container) {
      container.innerHTML = '';
      links
        .filter(l => l.active)
        .sort((a, b) => a.order - b.order)
        .forEach(link => {
          const clickable = document.createElement('a');
          clickable.href = link.url;
          clickable.target = "_blank";
          clickable.rel = "noopener noreferrer";
          clickable.style.width = "100%";
          const div = document.createElement('div');
          div.className = 'linkPreview';
          // div.innerHTML = `
          //   <div class="leftPreview"><img src="../assets/LogoJointInBlue.png" alt=""></div>
          //   <div class="middlePreview"><p class="myLinkPreview">${link.title}</p></div>
          //   <div class="rightPreview"></div>
          // `;
          div.innerHTML = `
            <div class="leftPreview">
              ${link.image 
              ? `<img src="${link.image}" alt="${link.title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` 
              : link.icon 
              ? `<span style="font-size:2rem">${link.icon}</span>`
              : `<img src="../assets/LogoJointInBlue.png" alt="">`
              }
            </div>
            <div class="middlePreview"><p class="myLinkPreview">${link.title}</p></div>
            <div class="rightPreview">
              ${link.image 
              ? `<img src="${link.image}" alt="${link.title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` 
              : link.icon 
              ? `<span style="font-size:1.4rem">${link.icon}</span>`
              : `<img src="../assets/LogoJointInBlue.png" alt="">`
              }
            </div>
          `;
          container.appendChild(clickable);
          clickable.appendChild(div);
        });
    }

    applyThemeApi();

  } catch (err) {
    console.error('[renderPreview]', err.message);
  }
}

function previewResponsive() {
  const user = document.getElementById('name');
  const biog = document.getElementById('bio');

  const userPreview = document.getElementById('usernamePreview');
  const bioPreview = document.getElementById('bioPreview');

  user.addEventListener('input', () => {
    userPreview.textContent = user.value;
  });

  biog.addEventListener('input', () => {
    bioPreview.textContent = biog.value;
  });

  const input = document.getElementById("pfp");
const preview = document.querySelector(".pfpPreview img");

input.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
        });

        reader.readAsDataURL(file);
    }
});
  
}


// Point d'entrée
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  initAvatarUpload();
  initButtons();
  renderPreview();
  previewResponsive();     //FONCTION AU MAUVAIS ENDROIT, IL FAUT QUE SA SOIT RESPONSIVE PAR RAPPORT SAVE/DISCARD BTN
});

const edit = document.getElementById('modifyProfil');
const editCard = document.getElementById('modify-profil');

edit.addEventListener('click', () => {
  editCard.style.display = "block";
});

