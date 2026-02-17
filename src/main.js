import './styles.css';
import { initThreeScene } from './three-scene.js';
import { initAnimations } from './animations.js';

// --- Init ---
// Vite loads modules async, so DOMContentLoaded may already have fired.
// Use readyState check to handle both cases.
function init() {
  initThreeScene();
  initAnimations();
  initNavigation();
  initActiveLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- Mobile Navigation ---
function initNavigation() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = mobileNav?.querySelectorAll('a');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', toggleMenu);
  mobileOverlay?.addEventListener('click', closeMenu);
  mobileLinks?.forEach((link) => link.addEventListener('click', closeMenu));
}

// --- Active Nav Link on Scroll ---
function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const mobileLinks = document.querySelectorAll('#mobile-nav a');

  function updateActiveLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        mobileLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}
