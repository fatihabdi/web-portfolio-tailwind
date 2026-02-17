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
  // --- Hero Entrance Animation ---
  gsap.set('.hero-greeting', { y: 20, opacity: 0 });
  gsap.set('.hero-title', { y: 30, opacity: 0 });
  gsap.set('.hero-buttons', { y: 30, opacity: 0 });

  const heroTl = gsap.timeline({ delay: 0.5 });

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
      '.hero-title',
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.5'
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
  // Shared toggleActions: play saat masuk, reverse saat scroll ke atas
  const TOGGLE = 'play none none reverse';

  // --- Section Headings ---
  gsap.utils.toArray('.section-label, .section-title').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  });

  // --- About Section ---
  gsap.fromTo(
    '.about-text',
    { x: -60, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.about-text',
        start: 'top 90%',
        toggleActions: TOGGLE,
      },
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    }
  );

  gsap.fromTo(
    '.about-connect',
    { x: 60, opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.about-connect',
        start: 'top 90%',
        toggleActions: TOGGLE,
      },
      x: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
    }
  );

  gsap.utils.toArray('.stat-item').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.about-stats',
          start: 'top 90%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: i * 0.15,
        ease: 'power3.out',
      }
    );
  });

  // --- Skills Cards ---
  gsap.utils.toArray('.skill-category').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 85%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.2,
        ease: 'power3.out',
      }
    );
  });

  // --- Portfolio Cards ---
  gsap.utils.toArray('.project-card').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.1, // reduced delay for grid
        ease: 'power3.out',
      }
    );
  });

  // --- Experience Timeline ---
  gsap.utils.toArray('.timeline-item').forEach((item, index) => {
    const isOdd = index % 2 === 0;
    const content = item.querySelector('.timeline-content');
    const dot = item.querySelector('.timeline-dot');

    if (content) {
      gsap.fromTo(
        content,
        { x: isOdd ? -60 : 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: TOGGLE,
          },
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }

    if (dot) {
      gsap.fromTo(
        dot,
        { scale: 0 },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: TOGGLE,
          },
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
        }
      );
    }
  });

  // --- Education Cards ---
  gsap.utils.toArray('.edu-card').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '#education',
          start: 'top 90%',
          toggleActions: TOGGLE,
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.2,
        ease: 'power3.out',
      }
    );
  });

  // --- Contact Section ---
  gsap.fromTo(
    '.contact-content',
    { y: 60, opacity: 0, scale: 0.95 },
    {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
        toggleActions: TOGGLE,
      },
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
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

  // --- Parallax bg glows ---
  gsap.utils.toArray('.bg-glow').forEach((glow) => {
    gsap.to(glow, {
      scrollTrigger: {
        trigger: glow.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: -80,
      ease: 'none',
    });
  });
}