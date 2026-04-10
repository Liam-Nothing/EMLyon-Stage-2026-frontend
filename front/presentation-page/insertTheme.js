let themesData = [];
const container = document.getElementById('theme');

// ======= FETCH THÈMES =======
fetch("/api/themes")
  .then(res => res.json())
  .then(data => {
    themesData = data;
    createCard(data);
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
            <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.colors.borderRadius}; border:${e.colors.border}; box-shadow:${e.colors.boxShadow}"></span>
            <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.colors.borderRadius}; border:${e.colors.border}; box-shadow:${e.colors.boxShadow}"></span>
            <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.colors.borderRadius}; border:${e.colors.border}; box-shadow:${e.colors.boxShadow}"></span>
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
      selectTheme(e.id);
    });

    container.appendChild(wrapper);
  });
}

// ======= SELECT CARDS =======
function selectTheme(id) {
  document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
  const card = document.getElementById(id);
  if (card) card.classList.add('selected');
}