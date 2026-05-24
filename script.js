/* ============================================================
   SUNAN KALIJAGA — script.js
   Handles: reveal animations, navbar scroll, mobile menu,
            active nav link, back-to-top
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar ── */
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll: add .scrolled class
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    backToTop.classList.toggle('show', y > 400);
    lastScroll = y;
  }, { passive: true });

  // Mobile hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Active nav link on scroll ── */
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
  const allNavLinks = Array.from(document.querySelectorAll('.nav-link'));

  function getActiveSection() {
    const scrollY = window.scrollY + window.innerHeight * 0.25;
    let active = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= scrollY) active = sec;
    }
    return active;
  }

  function updateActiveLink() {
    const active = getActiveSection();
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${active.id}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Back to top ── */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Smooth scroll offset for fixed navbar ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Tradisi scroll: add drag-to-scroll on desktop ── */
  const tradisiScroll = document.querySelector('.tradisi-scroll');
  if (tradisiScroll) {
    let isDown = false, startX, scrollLeft;
    tradisiScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      tradisiScroll.style.cursor = 'grabbing';
      startX = e.pageX - tradisiScroll.offsetLeft;
      scrollLeft = tradisiScroll.scrollLeft;
    });
    tradisiScroll.addEventListener('mouseleave', () => {
      isDown = false;
      tradisiScroll.style.cursor = '';
    });
    tradisiScroll.addEventListener('mouseup', () => {
      isDown = false;
      tradisiScroll.style.cursor = '';
    });
    tradisiScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - tradisiScroll.offsetLeft;
      tradisiScroll.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

  /* ── Animate trait cards on hover: subtle glow ── */
  document.querySelectorAll('.trait-card, .card, .dakwah-card, .hikmah-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s, border-color .25s';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transition = '';
    });
  });

  /* ── Timeline items: stagger on scroll ── */
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.12}s`;
  });

  /* ── Progress bar: reading indicator ── */
  const progressBar = document.createElement('div');
  progressBar.id = 'readingProgress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(to right, #C8963E, #E0B86A);
    z-index: 9999;
    transition: width .1s linear;
    pointer-events: none;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

})();
