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



// MENU BAR ================
const menu = document.getElementById('menu');
const menuSection = document.getElementById('menuSection');

menu.addEventListener('click', () => {
  document.body.classList.toggle('remove-scrolling');
  menuSection.classList.toggle('toggle');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.body.classList.remove('remove-scrolling');
  menuSection.classList.remove('toggle');
  }
});

// shows preview card
const showPreview = document.getElementById('showsPreview');

showPreview.addEventListener('click', () => {
  const sections = document.querySelectorAll('section');
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const footer = document.querySelector('footer');
  const aside = document.querySelector('aside');

  sections.forEach(section => {
    section.classList.add('hidden');
  });
  header.classList.add('hidden');
  nav.classList.add('hidden');
  footer.classList.add('hidden');
  
  aside.classList.add('fixedAp');
  aside.style.width = '100%';
  aside.style.height = '100%';
  aside.style.top = '0';
  document.body.classList.remove('remove-scrolling');

  const back = document.createElement('div');
  back.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
  back.style.fontSize = '20px';
  back.style.display = "inline-block";
  back.style.position = 'absolute';
  back.style.top = "0";
  back.style.left = "0";
  back.style.padding = '10px 15px';
  aside.appendChild(back);

  back.addEventListener('click', () => {
    back.style.display = 'none';

    aside.classList.remove('fixedAp');
    aside.style.width = '';
    aside.style.height = '';
    aside.style.top = '';
    document.body.classList.add('remove-scrolling');

    sections.forEach(section => {
      section.classList.remove('hidden');
    });
    header.classList.remove('hidden');
    nav.classList.remove('hidden');
    footer.classList.remove('hidden');
    menuSection.classList.add('toggle');

  });


  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {

      back.style.display = 'none';

      aside.classList.remove('fixedAp');
      aside.style.width = '';
      aside.style.height = '';
      aside.style.top = '';
      document.body.classList.add('remove-scrolling');

      sections.forEach(section => {
        section.classList.remove('hidden');
      });
      header.classList.remove('hidden');
      nav.classList.remove('hidden');
      footer.classList.remove('hidden');
      menuSection.classList.add('toggle');

      document.body.classList.remove('remove-scrolling');
      menuSection.classList.remove('toggle');

    }
  });

});

// ============================ 

// COPY TEXT  ===============================================

const copyLink = document.getElementById('nav-right');
const copyText = document.getElementById('myLinkCopy');

copyLink.addEventListener('click', () => {
    // const textToCopy = copyText.textContent; // seulement pour text
    // const textToCopy = copyText.href; // pour href de <a>
    const textToCopy = "https://" + copyText.textContent; //si c un span au lieu de <a>

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log('Texte copié !');
          showNotification("Link Copied !", "#36D399");
        })
        .catch(err => {
          console.error('Erreur de copie : ', err);
          showNotification("Couldn't copy link", "#FF5C72");
        });
});

// NEED TO DISPLAY A MSG (TOAST) TO SAY LINK COPIED
function showNotification(msg, color) {
  const toast = document.createElement('div');
  toast.classList.add('boxMessage');
  toast.style.background = color;
  toast.innerHTML = "<p>" + msg + "</p>";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}