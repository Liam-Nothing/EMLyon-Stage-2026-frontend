const themeColor = document.getElementById('colorTheme');
const wallpaperColor = document.getElementById('colorWallpaper');
const buttonColor = document.getElementById('colorButton');
const textColor = document.getElementById('colorTexte');

fetch("/api/profile/theme")
  .then(res => res.json())
  .then(data => {
    themeColor.style.background = data.colors.cardBackground;
    wallpaperColor.style.background = data.colors.cardBackground;
    buttonColor.style.background = data.colors.primary;
    textColor.style.background = data.colors.textColor;
  });