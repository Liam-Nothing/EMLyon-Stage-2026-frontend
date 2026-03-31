// Toast notification
function showToast(message, type = 'success') {

  // Supprimer un toast existant
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

  // Injection du keyframe si pas encore présent
  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
        .linkCard.dragging {
        opacity: 0.3;
        transform: scale(0.98);
      }
      .linkCard.drag-over {
        border-top: 3px solid var(--color-primary, #6C63FF);
      }
      .linkCard[draggable="true"] {
        cursor: grab;
      }
      .linkCard[draggable="true"]:active {
        cursor: grabbing;
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


// Affiche un message d'erreur inline sous un champ
function showFieldError(inputEl, message) {
  clearFieldError(inputEl);
  const err = document.createElement('span');
  err.className = 'field-error';
  err.textContent = message;
  err.style.cssText = 'color:#FF5C72;font-size:0.8rem;margin-top:4px;display:block;';
  inputEl.parentElement.appendChild(err);
  inputEl.style.borderColor = '#FF5C72';
}

function clearFieldError(inputEl) {
  const err = inputEl.parentElement.querySelector('.field-error');
  if (err) err.remove();
  inputEl.style.borderColor = '';
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
 
    // Bouton supprimer — on remonte jusqu'à .delete
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

    } catch (err) {
      console.error('[addLink]', err.message);
      showToast('Erreur réseau, réessayez', 'error');
    }
  };

  // Écoute submit sur le form ET clic sur le bouton
  form.addEventListener('submit', handleSubmit);
  if (btnAdd) btnAdd.addEventListener('click', handleSubmit);
}


// Point d'entrée
document.addEventListener('DOMContentLoaded', () => {
  loadLinks();
  initEventDelegation();
  initDragAndDrop();
  initAddLinkForm();
});