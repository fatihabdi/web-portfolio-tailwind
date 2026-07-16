import './styles.css';
import { initThreeScene, destroyThreeScene } from './three-scene.js';
import { initAnimations } from './animations.js';

// --- Init ---
function init() {
  initThreeScene();
  initTypingAnimation();
  initAnimations();
  initNavigation();
  initActiveLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --- Typing Animation ---
function initTypingAnimation() {
  const el = document.getElementById('typing-role');
  if (!el) return;

  const words = ['Software Engineer', 'QA Engineer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeout;

  function type() {
    const current = words[wordIndex];

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      el.textContent = current.substring(0, charIndex);

      if (charIndex === current.length) {
        // Pause at full word
        isDeleting = true;
        timeout = setTimeout(type, 2000);
        return;
      }
      timeout = setTimeout(type, 80 + Math.random() * 60);
    } else {
      // Deleting backward
      charIndex--;
      el.textContent = current.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeout = setTimeout(type, 400);
        return;
      }
      timeout = setTimeout(type, 40 + Math.random() * 30);
    }
  }

  // Start typing after GSAP hero animation completes
  setTimeout(type, 2000);
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
