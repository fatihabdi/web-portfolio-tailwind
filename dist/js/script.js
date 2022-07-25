// Navbar Fixed
window.onscroll = function () {
  const header = document.querySelector("header");
  const fixednav = header.offsetTop;

  if (window.pageYOffset > fixednav) {
    header.classList.add("navbar-fixed");
  } else {
    header.classList.remove("navbar-fixed");
  }
};

// Hamburger
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("hidden");
});

// Remove Nav when click on window
window.addEventListener("click", function (e) {
  if (e.target.id !== "hamburger" && e.target.id !== "nav-menu") {
    hamburger.classList.remove("hamburger-active");
    navMenu.classList.add("hidden");
  }
});
