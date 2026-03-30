// Toast notification
function showToast(message, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #fff;
    background: ${type === 'success' ? '#36D399' : '#FF5C72'};
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
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
  const name   = document.getElementById('name').value.trim();
  const bio    = document.getElementById('bio').value.trim();
  const avatar = window._pendingAvatar || undefined;

  // Validation côté client
  if (name && name.length > 50) {
    showToast('Le nom ne peut pas dépasser 50 caractères', 'error');
    return;
  }
  if (bio && bio.length > 160) {
    showToast('La bio ne peut pas dépasser 160 caractères', 'error');
    return;
  }

  const body = {};
  if (name)   body.name   = name;
  if (bio)    body.bio    = bio;
  if (avatar) body.avatar = avatar;

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
  }
}


// Upload avatar (base64)
function initAvatarUpload() {
  const input = document.getElementById('pfp');
  if (!input) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;

      // Prévisualisation immédiate
      document.querySelectorAll('.cardProfil img, .image-modify img').forEach(img => {
        img.src = base64;
      });

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
    });
  }

  // Annulé — recharge depuis l'API
  const btnCancel = document.querySelector('.btn-discard');
  if (btnCancel) {
    btnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      window._pendingAvatar = null;
      loadProfile();
      showToast('Modifications annulées');
    });
  }

  // Compteur bio — orange à 140, rouge à 160
  const bioInput = document.getElementById('bio');
  if (bioInput) {
    bioInput.addEventListener('input', () => {
      const len = bioInput.value.length;
      bioInput.style.borderColor = len > 160 ? '#FF5C72' : len > 140 ? '#f0a500' : '';
    });
  }
}


// Point d'entrée
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  initAvatarUpload();
  initButtons();
});