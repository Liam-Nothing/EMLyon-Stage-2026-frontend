const el = document.getElementById("backgroundColor");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    el.classList.add("fixed");
  } else {
    el.classList.remove("fixed");
  }
});

// ====== Chargement de la carte preview =========================================


function applyThemeApi() {
  fetch("/api/profile/theme")
  .then(response => response.json())
  .then(data => {
  
    const backgrounds = document.getElementById('backgroundColor');
    const card = document.getElementById('cardPreview');
    const h1 = document.getElementById('usernamePreview');
    const bio = document.getElementById('bioPreview');
    const footer = document.getElementById('footer');
    const foot = document.getElementById('stillFooter');
  
    const btnLink = document.querySelectorAll('.linkPreview');
    const textBtnLink = document.querySelectorAll('.myLinkPreview');
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




// // MENU BAR
// const menu = document.getElementById('menu');
// const main = document.querySelector('main');

// menu.addEventListener('click', () => {
//   const menuBar = document.createElement('div');
//   menuBar.style.display = "absolute";
//   menuBar.style.top = "5px";
//   menuBar.style.width = "100%";
//   menuBar.style.height = "100vh";
//   menuBar.style.background = "var(--background-color)";

//   main.appendChild(menuBar);
// });