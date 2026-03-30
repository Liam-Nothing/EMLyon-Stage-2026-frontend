function createCard(data) {
const container = document.getElementById('themeChoices');

data.forEach(e => {
  container.innerHTML += 
  `
  <div class="selectCard">
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
          <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.borderRadius}; border:${e.colors.border}; box-shadow:${e.boxShadow}""></span>
          <span class="linkLinks" style="background:${e.colors.primary}; border-radius:${e.borderRadius}; border:${e.colors.border}; box-shadow:${e.boxShadow}""></span>
        </div>
      </div>

      <div class="footerTheme">
        <span class="footTheme" style="background:${e.colors.textColor}"></span>
      </div>

    </div>

    <h3>${e.name}</h3>
  </div>
   `;
  });
}

try {
  fetch("../../back/data/themes.json")
  .then(response => response.json())
  .then(data => {

    createCard(data);

  })


} catch (error) {
  
console.log('error : Fail to load theme', error);

}

