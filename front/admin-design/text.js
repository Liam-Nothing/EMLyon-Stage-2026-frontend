const textColor = document.getElementById('textColorSelect');
const circleTextColor = document.getElementById('circleTextColor');
const nameTextColor = document.getElementById('nameTextColor');

textColor.addEventListener('input', () => {
  circleTextColor.style.background = textColor.value;
  nameTextColor.textContent = textColor.value;

  user.style.color = textColor.value;
  bio.style.color = textColor.value;
  foot.style.color = textColor.value;
  stillFoot.style.color = textColor.value;
});

const upSocial = document.getElementById('upBtn');
const downSocial = document.getElementById('downBtn');

upSocial.addEventListener('click', () => {
  downSocial.classList.remove('selected');
  upSocial.classList.add('selected');
});

downSocial.addEventListener('click', () => {
  downSocial.classList.add('selected');
  upSocial.classList.remove('selected');
});

const user = document.getElementById('usernamePreview');
const bio = document.getElementById('bioPreview');
const foot = document.getElementById('footer');
const stillFoot = document.getElementById('stillFooter');

const options = document.querySelectorAll('.optionStyle');

options.forEach(element => {
  element.addEventListener('click', () => {
    if (element.value === "Default") {
      user.style.fontFamily = "Rubik";
      bio.style.fontFamily = "Noto Sans";

      const myLink = document.querySelectorAll('.myLinkPreview');
      myLink.forEach(el => {
        el.style.fontFamily = "Noto Sans";
      });
      foot.style.fontFamily = "Noto Sans";
      stillFoot.style.fontFamily = "Noto Sans";
    } else {
      user.style.fontFamily = element.value;
      bio.style.fontFamily = element.value;
  
      const myLink = document.querySelectorAll('.myLinkPreview');
      myLink.forEach(el => {
        el.style.fontFamily = element.value;
      });
      foot.style.fontFamily = element.value;
      stillFoot.style.fontFamily = element.value;
    }
  })
});

fetch("/api/profile/theme")
  .then(res => res.json())
  .then(data => {
   circleTextColor.style.background = data.colors.textColor;
   nameTextColor.textContent = data.colors.textColor;

  })
  .catch(err => console.error('Error server', err));