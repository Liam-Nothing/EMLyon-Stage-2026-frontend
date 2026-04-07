// function applyThemeApi() {
//   fetch("/api/profile/theme")
//   .then(response => response.json())
//   .then(data => {
  
//     const backgrounds = document.getElementById('backgroundColor');
//     const card = document.getElementById('cardPreview');
//     const h1 = document.getElementById('usernamePreview');
//     const bio = document.getElementById('bioPreview');
//     const footer = document.getElementById('footer');
//     const foot = document.getElementById('stillFooter');
  
//     const btnLink = document.querySelectorAll('.linkPreview');
//     const textBtnLink = document.querySelectorAll('.myLinkPreview');
//     const imageLeft = document.querySelectorAll('.leftPreview');
//     const imageRight = document.querySelectorAll('.rightPreview');
  
  
//     backgrounds.style.backgroundColor = data.colors.background;
//     card.style.background = data.colors.cardBackground;
//     h1.style.color = data.colors.textColor;
//     bio.style.color = data.colors.textColor;
//     footer.style.color = data.colors.textColor;
//     foot.style.color = data.colors.textColor;
    
//     btnLink.forEach(btn => {
//       btn.style.backgroundColor = data.colors.primary;
//       btn.style.borderRadius = data.colors.borderRadius;
//       btn.style.border = data.colors.border;
//       btn.style.boxShadow = data.colors.boxShadow;
//     });
  
//     textBtnLink.forEach(text => {
//       text.style.color = data.colors.linkTextColor;
//     });
  
//     imageLeft.forEach(img => {
//       img.style.borderRadius = data.colors.borderRadius;
//     });
  
//     imageRight.forEach(img => {
//       img.style.borderRadius = data.colors.borderRadius;
//     });
  
//   })
  
//   .catch (error => {
//     console.log('error : Fail to load colors', error);
//   });

// }



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

renderPreview();