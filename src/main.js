import './styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from './projects.js';
gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const duration = reduced ? 0 : 0.8;
document.querySelector('#year').textContent = new Date().getFullYear();

const deck = document.querySelector('.project-deck');
const stage = document.querySelector('.project-stage');
let current = 0;
let moving = false;
projects.forEach((project, i) => {
  const card = document.createElement('a');
  card.className = 'project-card';
  card.href = project.url;
  card.target = '_blank';
  card.rel = 'noopener';
  card.setAttribute('aria-label', `View ${project.title}`);
  const image = document.createElement('img');
  image.src = project.image;
  image.alt = project.title;
  image.loading = 'lazy';
  card.append(image);
  deck.append(card);
});
const cards = [...deck.children];
function renderProject(animate = false, direction = 1) {
  const project = projects[current];
  document.querySelector('.project-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
  const description = document.querySelector('.project-description');
  description.querySelector('h3').textContent = project.title;
  description.querySelector('p').textContent = project.desc;
  description.querySelector('.project-tech').textContent = project.tech.join(' · ');
  description.querySelector('a').href = project.url;
  if (animate) gsap.fromTo(description, {y:20 * direction, opacity:0, filter:'blur(6px)'}, {y:0, opacity:1, filter:'blur(0px)', duration});
  cards.forEach((card, i) => {
    let offset = (i - current + projects.length) % projects.length;
    if (offset > projects.length / 2) offset -= projects.length;
    const active = offset === 0;
    card.tabIndex = active ? 0 : -1;
    card.setAttribute('aria-hidden', String(!active));
    card.style.pointerEvents = active ? 'auto' : 'none';
    gsap.to(card, {y:offset * 160, x:Math.abs(offset) * 25, scale:active ? 1 : .55, rotation:offset * -3, opacity:Math.abs(offset) <= 1 ? (active ? 1 : .35) : 0, filter:active ? 'blur(0px)' : 'blur(5px)', zIndex:10 - Math.abs(offset), duration:animate ? duration : 0, ease:'power3.inOut'});
  });
}
function changeProject(direction) {
  if (moving) return;
  moving = true;
  current = (current + direction + projects.length) % projects.length;
  renderProject(true, direction);
  gsap.delayedCall(duration, () => { moving = false; });
}
document.querySelector('.previous').addEventListener('click', () => changeProject(-1));
document.querySelector('.next').addEventListener('click', () => changeProject(1));
stage.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    changeProject(event.key === 'ArrowRight' ? 1 : -1);
  }
});
let touchX;
deck.addEventListener('touchstart', event => { touchX = event.changedTouches[0].clientX; }, {passive:true});
deck.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].clientX - touchX;
  if (Math.abs(delta) > 50) changeProject(delta < 0 ? 1 : -1);
}, {passive:true});
renderProject();

document.querySelectorAll('.service-heading').forEach(button => {
  const body = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    body.inert = isOpen;
    gsap.to(body, {height:isOpen ? 0 : 'auto', duration:reduced ? 0 : .6, ease:'power3.inOut', onComplete:() => ScrollTrigger.refresh()});
  });
});

const words = ['CONTACT','KONTAK','連絡','CONTACTO','연락','CONTATTO','تواصل','CONTACT','KONTAKT','ΕΠΙΚΟΙΝΩΝΙΑ','CONTACTO','連絡','KONTAK','CONTACT','연락','CONTATTO','KONTAKT','تواصل'];
const cloud = document.querySelector('.contact-cloud');
words.forEach((word,i) => {
  const span = document.createElement('span');
  span.className = 'contact-word';
  span.textContent = word;
  span.style.left = `${(i * 29) % 85}%`;
  span.style.top = `${5 + (i * 17) % 83}%`;
  cloud.append(span);
});

function initMotion() {
  const loader = document.querySelector('.loader');
  const finishOpening = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.classList.remove('is-loading');
    loader.remove();
    ScrollTrigger.refresh();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  if (!reduced) {
    const signature = loader.querySelector('path');
    const signatureLength = signature.getTotalLength();
    gsap.set(signature, {strokeDasharray: signatureLength, strokeDashoffset: signatureLength});
    gsap.timeline({onComplete:finishOpening})
      .to('.loader path', {strokeDashoffset:0, duration:.75, ease:'power2.inOut'})
      .to('.loader', {yPercent:-100, duration:.85, ease:'power4.inOut'}, '+=.15');
    gsap.from('.hero h1 span', {y:65, opacity:0, filter:'blur(10px)', duration:1.15, delay:1.1, ease:'power3.out'});
    gsap.from('.hero-portrait', {opacity:0, duration:1.2, delay:1.2, ease:'power3.out'});
    gsap.from('.hero-bottom', {opacity:0, duration:.8, delay:1.7});
    gsap.fromTo('.hero h1', {y:0, opacity:1, filter:'blur(0px)'}, {y:-100, opacity:0, immediateRender:false, scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom 40%', scrub:1}});
    gsap.fromTo('.hero-portrait', {y:0}, {y:100, immediateRender:false, scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:1}});
    document.querySelectorAll('.reveal').forEach(element => {
      gsap.from(element, {y:45, opacity:0, filter:'blur(9px)', duration:1, ease:'power3.out', scrollTrigger:{trigger:element, start:'top 90%', toggleActions:'play none none reverse'}});
    });
    gsap.to('.blue-sweep', {top:'-35%', rotation:25, borderRadius:'0%', ease:'none', scrollTrigger:{trigger:'.services-intro', start:'top 15%', end:'bottom bottom', scrub:1}});
    document.querySelectorAll('.service-image img').forEach(image => {
      gsap.fromTo(image, {scale:.88, y:30}, {scale:1, y:0, ease:'none', scrollTrigger:{trigger:image.parentElement, start:'top bottom', end:'bottom 40%', scrub:1}});
    });
    gsap.from('.project-deck', {scale:.5, opacity:0, filter:'blur(12px)', duration:1.1, scrollTrigger:{trigger:'.project-stage',start:'top 80%'}});
    gsap.to('.contact-word', {opacity:.22, y:-90, stagger:.025, ease:'none', scrollTrigger:{trigger:'.contact',start:'top 30%',end:'bottom bottom',scrub:1}});
    gsap.from('.contact-center h2', {filter:'blur(12px)', scale:.9, opacity:0, duration:1, scrollTrigger:{trigger:'.contact', start:'top 50%'}});
    gsap.from('.footer-name', {opacity:.2, y:35, scrollTrigger:{trigger:'footer',start:'top 90%',end:'bottom bottom',scrub:1}});
  } else {
    finishOpening();
    gsap.set('.contact-word', {opacity:.15});
    document.querySelector('.blue-sweep').style.display = 'none';
  }
  ScrollTrigger.create({trigger:'.hero', start:'top -100', onEnter:() => gsap.to('.nav-logo',{opacity:1,duration:duration/2}), onLeaveBack:() => gsap.to('.nav-logo',{opacity:0,duration:duration/2})});
  const nav = document.querySelector('.navbar');
  function updateNav() {
    const y = scrollY + 35;
    const darkSections = [...document.querySelectorAll('.expertise,.contact,footer')];
    nav.classList.toggle('on-dark',darkSections.some(el => y >= el.offsetTop && y < el.offsetTop + el.offsetHeight));
  }
  addEventListener('scroll', updateNav, {passive:true});
  updateNav();
  ScrollTrigger.refresh();
}
initMotion();
addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
document.fonts.ready.then(() => ScrollTrigger.refresh());
