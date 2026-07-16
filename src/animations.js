import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      createHeroAnimation();
      createScrollAnimations();
      ScrollTrigger.refresh();
    });
  });
}

function createHeroAnimation() {
  gsap.set('.hero-greeting', { y: 20, opacity: 0 });
  gsap.set('.hero-role-wrapper', { y: 20, opacity: 0 });
  gsap.set('.hero-tagline', { y: 30, opacity: 0 });
  gsap.set('.hero-meta', { y: 20, opacity: 0 });
  gsap.set('.hero-buttons', { y: 30, opacity: 0 });

  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to('.hero-greeting', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .to(
      '.hero-name .line-inner',
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
      },
      '-=0.4'
    )
    .to(
      '.hero-role-wrapper',
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .to(
      '.hero-tagline',
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5'
    )
    .to(
      '.hero-meta',
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.3'
    )
    .to(
      '.hero-buttons',
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .to(
      '.hero-scroll-indicator',
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.2'
    );
}

function createScrollAnimations() {
  const TOGGLE = 'play none none reverse';

  // --- Section Headers ---
  gsap.utils.toArray('.section-number, .section-label, .section-title').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      }
    );
  });

  // --- Work Cards ---
  gsap.utils.toArray('.work-card').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.08,
        ease: 'power3.out',
      }
    );
  });

  // --- Skills Intro ---
  gsap.fromTo(
    '.skills-intro',
    { y: 30, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.skills-intro',
        start: 'top 90%',
        toggleActions: TOGGLE,
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    }
  );

  // --- Skill Categories ---
  gsap.utils.toArray('.skill-category').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 85%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.15,
        ease: 'power3.out',
      }
    );
  });

  // --- Career Items ---
  gsap.utils.toArray('.career-item').forEach((el, i) => {
    gsap.fromTo(
      el,
      { x: -30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: TOGGLE,
        },
        x: 0,
        opacity: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out',
      }
    );
  });

  // --- Lab Cards ---
  gsap.utils.toArray('.lab-card').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out',
      }
    );
  });

  // --- Contact Section ---
  gsap.fromTo(
    '.contact-about',
    { x: -40, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
        toggleActions: TOGGLE,
      },
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    }
  );

  gsap.fromTo(
    '.contact-info',
    { x: 40, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
        toggleActions: TOGGLE,
      },
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    }
  );

  gsap.utils.toArray('.contact-stat').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.contact-stats',
          start: 'top 88%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: i * 0.15,
        ease: 'power3.out',
      }
    );
  });

  // --- Lab Footer ---
  gsap.fromTo(
    '.lab-footer',
    { y: 30, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.lab-footer',
        start: 'top 95%',
        toggleActions: TOGGLE,
      },
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
    }
  );

  // --- Career Download ---
  gsap.fromTo(
    '.career-download',
    { y: 20, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.career-download',
        start: 'top 95%',
        toggleActions: TOGGLE,
      },
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
    }
  );

  // --- Navbar scroll effect ---
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;
      if (self.direction === 1 && self.progress > 0) {
        navbar.classList.add('scrolled');
      }
      if (self.progress === 0) {
        navbar.classList.remove('scrolled');
      }
    },
  });
}