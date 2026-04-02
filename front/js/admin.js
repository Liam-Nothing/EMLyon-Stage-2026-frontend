// Toast notification
// function showToast(message, type = 'success') {

//   // Supprimer un toast existant
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

//   // Injection du keyframe si pas encore présent
//   if (!document.getElementById('toast-style')) {
//     const style = document.createElement('style');
//     style.id = 'toast-style';
//     style.textContent = `
//       @keyframes slideIn {
//         from { opacity: 0; transform: translateY(12px); }
//         to   { opacity: 1; transform: translateY(0); }
//       }
//         .linkCard.dragging {
//         opacity: 0.3;
//         transform: scale(0.98);
//       }
//       .linkCard.drag-over {
//         border-top: 3px solid var(--color-primary, #6C63FF);
//       }
//       .linkCard[draggable="true"] {
//         cursor: grab;
//       }
//       .linkCard[draggable="true"]:active {
//         cursor: grabbing;
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   document.body.appendChild(toast);
//   setTimeout(() => toast.remove(), 3000);
// }

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


// Affiche un message d'erreur inline sous un champ
function showFieldError(inputEl, message) {
  const errorEl = document.getElementById('error-' + inputEl.id.replace('input-', ''));
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  inputEl.addEventListener('input', () => clearFieldError(inputEl), { once: true });
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('input-error');
  const errorEl = document.getElementById('error-' + inputEl.id.replace('input-', ''));
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}


// Crée une linkCard DOM à partir d'un objet lien
function createLinkCard(link) {
  const card = document.createElement('div');
  card.className = 'linkCard';
  card.dataset.id = link.id;
  card.draggable  = true;
  if (!link.active) card.style.opacity = '0.45';

  card.innerHTML = `
    <div class="drag">
      <i class="fa-solid fa-grip-vertical"></i>
    </div>

    <div class="linkContent">
      <div class="linkHeader">
        <strong>${link.title}</strong>
        <button class="edit" title="Modifier">
          <i class="fa-solid fa-pen"></i>
        </button>
      </div>

      <div class="url">${link.url}</div>

      <hr>

      <div class="linkActions">
        <span class="imageLink">
          <i class="fa-regular fa-image"></i>
        </span>

        <div class="linkActionRight">
          <button class="delete" title="Supprimer">
            <i class="fa-solid fa-trash"></i>
          </button>

          <label class="switch">
            <input type="checkbox" class="toggle-active" ${link.active ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  `;

  // // Bouton supprimer 
  // card.querySelector('.delete').addEventListener('click', () => deleteLink(link.id, card));

  // // Toggle actif/inactif 
  // card.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
  //   toggleLink(link.id, e.target.checked);
  // });

  if (!link.active) card.style.opacity = '0.45';
  return card;
}

function createEditForm(card, link) {
  const originalHTML = card.innerHTML;

  card.innerHTML = `
    <div class="linkContent" style="width:100%">
      <div class="edit-form">
        <input type="text" class="edit-title" value="${link.title}" placeholder="Titre">
        <input type="url"  class="edit-url"   value="${link.url}"   placeholder="https://...">
        <div class="edit-actions">
          <button class="edit-cancel  btn-discard small-btn">Annuler</button>
          <button class="edit-save    btn-main    small-btn">Sauvegarder</button>
        </div>
      </div>
    </div>
  `;

  // Annuler — restaure l'HTML original
  card.querySelector('.edit-cancel').addEventListener('click', () => {
    card.innerHTML = originalHTML;
    card.draggable = true;
  });

  // Sauvegarder
  card.querySelector('.edit-save').addEventListener('click', async () => {
    const title = card.querySelector('.edit-title').value.trim();
    const url   = card.querySelector('.edit-url').value.trim();

    if (!title) { showToast('Le titre est requis', 'error'); return; }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      showToast("L'URL doit commencer par http:// ou https://", 'error');
      return;
    }

    try {
      const res  = await fetch(`/api/links/${link.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ title, url }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Erreur', 'error'); return; }

      // Remplacer la card par la version mise à jour
      const newCard = createLinkCard({ ...link, title, url });
      card.replaceWith(newCard);
      showToast('Lien modifié ✓');
      renderPreview();

    } catch (err) {
      showToast('Erreur réseau', 'error');
    }
  });

  card.draggable = false; 
}


function initDragAndDrop() {
  const linkList = document.getElementById('linkList');
  if (!linkList) return;
 
  let draggedCard = null;
 
  // Utilise la délégation sur le container
  linkList.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.linkCard');
    if (!card) return;
 
    draggedCard = card;
    // Léger délai pour que le navigateur capture le ghost avant l'ajout de classe
    setTimeout(() => card.classList.add('dragging'), 0);
    e.dataTransfer.effectAllowed = 'move';
  });
 
  linkList.addEventListener('dragend', (e) => {
    const card = e.target.closest('.linkCard');
    if (!card) return;
 
    card.classList.remove('dragging');
    // Retirer tous les indicateurs drag-over
    linkList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedCard = null;
  });
 
  linkList.addEventListener('dragover', (e) => {
    e.preventDefault(); // nécessaire pour autoriser le drop
    e.dataTransfer.dropEffect = 'move';
 
    const target = e.target.closest('.linkCard');
    if (!target || target === draggedCard) return;
 
    // Indicateur visuel sur la card survolée
    linkList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    target.classList.add('drag-over');
  });
 
  linkList.addEventListener('dragleave', (e) => {
    const target = e.target.closest('.linkCard');
    if (target) target.classList.remove('drag-over');
  });
 
  linkList.addEventListener('drop', (e) => {
    e.preventDefault();
 
    const target = e.target.closest('.linkCard');
    if (!target || !draggedCard || target === draggedCard) return;
 
    target.classList.remove('drag-over');
 
    // Calculer la position du drop (avant ou après la target)
    const rect   = target.getBoundingClientRect();
    const midY   = rect.top + rect.height / 2;
    const isAfter = e.clientY > midY;
 
    if (isAfter) {
      target.after(draggedCard);
    } else {
      target.before(draggedCard);
    }
 
    // Sauvegarder le nouvel ordre
    saveReorder();
  });
}
 

// Envoie le nouvel ordre à l'API
async function saveReorder() {
  const linkList = document.getElementById('linkList');
  if (!linkList) return;
 
  const cards    = [...linkList.querySelectorAll('.linkCard')];
  const newOrder = cards.map((card, index) => ({
    id:    card.dataset.id,
    order: index + 1,
  }));
 
  try {
    const res = await fetch('/api/links/reorder', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(newOrder),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    showToast('Ordre sauvegardé ✓');
    renderPreview();
  } catch (err) {
    console.error('[saveReorder]', err.message);
    showToast("Erreur lors de la sauvegarde de l'ordre", 'error');
  }
}


function initEventDelegation() {
  const linkList = document.getElementById('linkList');
  if (!linkList) return;
 
  // Délégation : clic 
  linkList.addEventListener('click', async (e) => {

    // Bouton edit
    const editBtn = e.target.closest('.edit');
    if (editBtn) {
      const card = e.target.closest('.linkCard');
      if (!card) return;
      const id    = card.dataset.id;
      const title = card.querySelector('strong').textContent;
      const url   = card.querySelector('.url').textContent;
      createEditForm(card, { id, title, url });
      return;
    }
 
    // Bouton supprimer
    const deleteBtn = e.target.closest('.delete');
    if (deleteBtn) {
      const card = e.target.closest('.linkCard');
      if (!card) return;
      const id = card.dataset.id;
 
      if (!confirm('Supprimer ce lien ?')) return;
 
      try {
        const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        card.remove();
        showToast('Lien supprimé ✓');
        renderPreview();
      } catch (err) {
        console.error('[deleteLink]', err.message);
        showToast('Erreur lors de la suppression', 'error');
      }
      return;
    }
 
  });
 


  // Délégation : change (toggle checkbox) 
  linkList.addEventListener('change', async (e) => {
 
    const checkbox = e.target.closest('.toggle-active');
    if (!checkbox) return;
 
    const card   = e.target.closest('.linkCard');
    if (!card) return;
    const id     = card.dataset.id;
    const active = checkbox.checked;
 
    try {
      const res = await fetch(`/api/links/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      card.style.opacity = active ? '1' : '0.45';
      showToast(active ? 'Lien activé ✓' : 'Lien désactivé ✓');
      renderPreview();
    } catch (err) {
      console.error('[toggleLink]', err.message);
      // Remettre la checkbox dans son état précédent
      checkbox.checked = !active;
      showToast('Erreur lors de la mise à jour', 'error');
    }
 
  });
}



// Chargement initial des liens depuis l'API
async function loadLinks() {
  const linkList = document.getElementById('linkList');
  if (!linkList) return;

  try {
    const res   = await fetch('/api/links');
    const links = await res.json();

    // Vider les cards hardcodées
    linkList.innerHTML = '';

    if (links.length === 0) {
      linkList.innerHTML = '<p style="text-align:center;opacity:0.5">Aucun lien pour l\'instant</p>';
      return;
    }

    links
      .sort((a, b) => a.order - b.order)
      .forEach(link => linkList.appendChild(createLinkCard(link)));

  } catch (err) {
    console.error('[loadLinks]', err.message);
    showToast('Impossible de charger les liens', 'error');
  }
}


// // Suppression d'un lien
// async function deleteLink(id, cardEl) {
//   if (!confirm('Supprimer ce lien ?')) return;

//   try {
//     const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });

//     if (!res.ok) throw new Error(`Status ${res.status}`);

//     cardEl.remove();
//     showToast('Lien supprimé ✓');

//   } catch (err) {
//     console.error('[deleteLink]', err.message);
//     showToast('Erreur lors de la suppression', 'error');
//   }
// }


// // Toggle actif/inactif
// async function toggleLink(id, active) {
//   try {
//     const res = await fetch(`/api/links/${id}`, {
//       method:  'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body:    JSON.stringify({ active }),
//     });

//     if (!res.ok) throw new Error(`Status ${res.status}`);

//     showToast(active ? 'Lien activé ✓' : 'Lien désactivé ✓');

//   } catch (err) {
//     console.error('[toggleLink]', err.message);
//     showToast('Erreur lors de la mise à jour', 'error');
//   }
// }


// Soumission du formulaire "Ajouter un lien"
function initAddLinkForm() {
  const form     = document.getElementById('add-link-form');
  const inputTitle = document.getElementById('input-title');
  const inputUrl   = document.getElementById('input-url');
  const btnAdd     = document.getElementById('btn-add-link');
  const btnCancel  = document.getElementById('btn-cancel');

  if (!form || !inputTitle || !inputUrl) return;

  // Bouton Annuler — vide le formulaire
  if (btnCancel) {
    btnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      inputTitle.value = '';
      inputUrl.value   = '';
      clearFieldError(inputTitle);
      clearFieldError(inputUrl);
    });
  }

  // Soumission via le bouton "Ajouter le lien"
  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = inputTitle.value.trim();
    const url   = inputUrl.value.trim();

    // Validation côté client 
    let valid = true;
    clearFieldError(inputTitle);
    clearFieldError(inputUrl);

    if (!title) {
      showFieldError(inputTitle, 'Le titre est requis');
      valid = false;
    }

    if (!url) {
      showFieldError(inputUrl, "L'URL est requise");
      valid = false;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      showFieldError(inputUrl, "L'URL doit commencer par http:// ou https://");
      valid = false;
    }

    if (!valid) return;

    //  Appel API POST 
    try {
      const res = await fetch('/api/links', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ title, url }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Erreur lors de l\'ajout', 'error');
        return;
      }

      // Succès 
      inputTitle.value = '';
      inputUrl.value   = '';
      clearFieldError(inputTitle);
      clearFieldError(inputUrl);

      // Ajouter la card dans la liste sans recharger
      const linkList = document.getElementById('linkList');
      if (linkList) {
        // Retirer le message "Aucun lien" s'il existe
        const empty = linkList.querySelector('p');
        if (empty) empty.remove();

        linkList.appendChild(createLinkCard(data));
      }

      showToast('Lien ajouté ✓');
      renderPreview();

    } catch (err) {
      console.error('[addLink]', err.message);
      showToast('Erreur réseau, réessayez', 'error');
    }
  };

  // Écoute submit sur le form ET clic sur le bouton
  form.addEventListener('submit', handleSubmit);
  if (btnAdd) btnAdd.addEventListener('click', handleSubmit);
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
    if (pfp) {
      const img = pfp.querySelector('img');
      if (img) img.src = profile.avatar || '';
    }

    const nameEl = document.getElementById('usernamePreview');
    const bioEl  = document.getElementById('bioPreview');
    if (nameEl) nameEl.textContent = profile.name || '';
    if (bioEl)  bioEl.textContent  = profile.bio  || '';

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
          div.innerHTML = `
            <div class="leftPreview"><img src="../assets/LogoJointInBlue.png" alt=""></div>
            <div class="middlePreview"><p class="myLinkPreview">${link.title}</p></div>
            <div class="rightPreview"></div>
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

// Point d'entrée
document.addEventListener('DOMContentLoaded', () => {
  loadLinks();
  initEventDelegation();
  initDragAndDrop();
  initAddLinkForm();
  renderPreview();
});