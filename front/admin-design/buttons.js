const outline = document.getElementById('shadowSection');

const solidBtn = document.getElementById('solidBtn');
const outlineBtn = document.getElementById('outlineBtn');

solidBtn.addEventListener('click', () => {
  outlineBtn.classList.remove('selected');
  solidBtn.classList.remove('unselected');
  outlineBtn.classList.add('unselected');
  solidBtn.classList.add('selected');

  outline.style.display = 'flex';
});

outlineBtn.addEventListener('click', () => {
  outlineBtn.classList.remove('unselected');
  solidBtn.classList.remove('selected');
  outlineBtn.classList.add('selected');
  solidBtn.classList.add('unselected');

  outline.style.display = "none";
});

// ===== COLORS PICK =================

// BUTTON COLOR
const btnColor = document.getElementById('colorButtonSelect');
const btnCircle = document.getElementById('circleButtonColor');
const btnName = document.getElementById('nameButtonColor');

btnColor.addEventListener('input', () => {
  btnCircle.style.background = btnColor.value;
  btnName.textContent = btnColor.value;
});

// BUTTON TEXT COLOR
const textColor = document.getElementById('colorTextBtnSelect');
const textCircle = document.getElementById('circleTextBtnColor');
const textName = document.getElementById('nameTextBtnColor');

textColor.addEventListener('input', () => {
  textCircle.style.background = textColor.value;
  textName.textContent = textColor.value;
});

// BORDER RADIUS
const square = document.getElementById('squareRadius');
const round = document.getElementById('roundRadius');
const rounder = document.getElementById('rounderRadius');
const full = document.getElementById('fullRadius');

function radiusSelected(x, a, b, c) {
  x.addEventListener('click', () => {
    a.classList.remove('selected');
    b.classList.remove('selected');
    c.classList.remove('selected');
    x.classList.add('selected');
  });
}
radiusSelected(square, round, rounder, full);
radiusSelected(round, rounder, full, square);
radiusSelected(rounder, full, square, round);
radiusSelected(full, square, round, rounder);

// SOLID BOX SHADOW
const none = document.getElementById('noneShadow');
const soft = document.getElementById('softShadow');
const strong = document.getElementById('strongShadow');
const hard = document.getElementById('hardShadow');

radiusSelected(none, soft, strong, hard);
radiusSelected(soft, strong, hard, none);
radiusSelected(strong, hard, none, soft);
radiusSelected(hard, none, soft, strong);

// ====== APPLYING THOSE STYLE =======================================
// ===================================================================

