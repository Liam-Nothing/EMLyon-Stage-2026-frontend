const outline = document.getElementById('shadowSection');

const solidBtn = document.getElementById('solidBtn');
const outlineBtn = document.getElementById('outlineBtn');

solidBtn.addEventListener('click', () => {
  outlineBtn.classList.remove('selected');
  solidBtn.classList.remove('unselected');
  outlineBtn.classList.add('unselected');
  solidBtn.classList.add('selected');

  outline.style.display = 'flex';

  const linkPreview = document.querySelectorAll('.linkPreview');
  linkPreview.forEach(element => {
    element.style.background = btnColor.value;
    element.style.border = "none";
  });

  selectShadow("none");
});

outlineBtn.addEventListener('click', () => {
  outlineBtn.classList.remove('unselected');
  solidBtn.classList.remove('selected');
  outlineBtn.classList.add('selected');
  solidBtn.classList.add('unselected');

  outline.style.display = "none";

  const linkPreview = document.querySelectorAll('.linkPreview');
  linkPreview.forEach(element => {
    element.style.background = "none";
    element.style.border = "2px solid " + btnColor.value;
    element.style.boxShadow = "none";
  });
});

// ===== COLORS PICK =================

// BUTTON COLOR
const btnColor = document.getElementById('colorButtonSelect');
const btnCircle = document.getElementById('circleButtonColor');
const btnName = document.getElementById('nameButtonColor');

// =========================================================================
function updateLinkPreviewColor() {
  const linkPreview = document.querySelectorAll('.linkPreview');

  linkPreview.forEach(element => {
    if (solidBtn.classList.contains('selected')) {
      // Solid
      element.style.background = btnColor.value;
      element.style.border = "none";
    } else if (outlineBtn.classList.contains('selected')) {
      // Outline
      element.style.background = "none";
      element.style.border = "2px solid " + btnColor.value;
    }
  });
}

// ===========================================================
btnColor.addEventListener('input', () => {
  btnCircle.style.background = btnColor.value;
  btnName.textContent = btnColor.value;
  
  updateLinkPreviewColor();
});
// ===========================================================


// BUTTON TEXT COLOR
const textColor = document.getElementById('colorTextBtnSelect');
const textCircle = document.getElementById('circleTextBtnColor');
const textName = document.getElementById('nameTextBtnColor');

textColor.addEventListener('input', () => {
  textCircle.style.background = textColor.value;
  textName.textContent = textColor.value;

  const textLink = document.querySelectorAll('.myLinkPreview');
  textLink.forEach(element => {
    element.style.color = textColor.value;
  });
});

// BORDER RADIUS
const square = document.getElementById('squareRadius');
const round = document.getElementById('roundRadius');
const rounder = document.getElementById('rounderRadius');
const full = document.getElementById('fullRadius');

function radiusSelected(x, a, b, c, value) {
  x.addEventListener('click', () => {
    a.classList.remove('selected');
    b.classList.remove('selected');
    c.classList.remove('selected');
    x.classList.add('selected');

    const linkPreview = document.querySelectorAll('.linkPreview');
    linkPreview.forEach(element => {
      element.style.borderRadius = value;
      element.style.boxShadow = value;
    });
  });
}

// SOLID BOX SHADOW
const none = document.getElementById('noneShadow');
const soft = document.getElementById('softShadow');
const strong = document.getElementById('strongShadow');
const hard = document.getElementById('hardShadow');

// ====== APPLYING THOSE STYLE ALREADY SELECTED =======================================
// ===================================================================

fetch("/api/profile/theme")
  .then(res => res.json())
  .then(data => {
    const colorValue = data.colors.primary;
    const borderRadius = data.colors.borderRadius;
    const boxShadow = data.colors.boxShadow;

    selectButtonSolidOutline(colorValue);
    selectBordorRadius(borderRadius);
    selectShadow(boxShadow);
    btnCircle.style.background = data.colors.primary;
    textCircle.style.background = data.colors.linkTextColor;
    btnName.textContent = data.colors.primary;
    textName.textContent = data.colors.linkTextColor;

    

  })
  .catch(err => console.error('Error server', err));


function selectButtonSolidOutline(value) {
  if (!value) return;
  const normalized = value.trim().toLowerCase();

    if (normalized.includes('#')) {
        // Solid
        outlineBtn.classList.remove('selected');
        solidBtn.classList.remove('unselected');
        outlineBtn.classList.add('unselected');
        solidBtn.classList.add('selected');

        outline.style.display = 'flex';
    } else {
        // Outline
        outlineBtn.classList.remove('unselected');
        solidBtn.classList.remove('selected');
        outlineBtn.classList.add('selected');
        solidBtn.classList.add('unselected');

        outline.style.display = "none";
    }
}

function radiusAlreadySelected(x, a, b, c) {
    a.classList.remove('selected');
    b.classList.remove('selected');
    c.classList.remove('selected');
    x.classList.add('selected');
}

function selectBordorRadius(value) {
  if (value === "0px") {
    radiusAlreadySelected(square, round, rounder, full);
  } else if (value === "5px") {
    radiusAlreadySelected(round, rounder, full, square);
  } else if (value === "15px") {
    radiusAlreadySelected(rounder, full, square, round);
  } else if (value === "50px") {
    radiusAlreadySelected(full, square, round, rounder);
  }
}

function selectShadow(value) {
  const normalized = value.trim().toLowerCase();

  if (value === "none") {
    radiusAlreadySelected(none, soft, strong, hard);
  } else if (value === "3px 3px 6px rgba(0, 0, 0, 0.09)") {
    radiusAlreadySelected(soft, strong, hard, none);
  } else if (value === "3px 3px 4px rgba(0, 0, 0, 0.25)") {
    radiusAlreadySelected(strong, hard, none, soft);
  } else if (normalized.includes("2px 3px 0 1px")) {
    radiusAlreadySelected(hard, none, soft, strong);
  }
}

radiusSelected(square, round, rounder, full, "0px");
radiusSelected(round, rounder, full, square, "5px");
radiusSelected(rounder, full, square, round, "15px");
radiusSelected(full, square, round, rounder, "50px");

radiusSelected(none, soft, strong, hard, "none");
radiusSelected(soft, strong, hard, none, "3px 3px 6px rgba(0, 0, 0, 0.09)");
radiusSelected(strong, hard, none, soft, "3px 3px 4px rgba(0, 0, 0, 0.25)");
radiusSelected(hard, none, soft, strong, "2px 3px 0 1px #000000");
