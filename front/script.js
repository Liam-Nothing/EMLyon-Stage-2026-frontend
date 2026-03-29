const el = document.getElementById("backgroundColor");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    el.classList.add("fixed");
  } else {
    el.classList.remove("fixed");
  }
});